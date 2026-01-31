import { ISubmission, SubmissionStatus } from "../models/submission.model";
import { ISubmissionRepository } from "../repository/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { getProblemById } from "../api/problem.client";
import logger from "../config/logger.config";
import { publishSubmissionCreated } from "../messaging/submission.publisher";
import { getCorrelationId } from "../utils/helpers/request.helpers";

export interface ISubmissionService {
  createSubmission(submission: Partial<ISubmission>): Promise<ISubmission>;
  getSubmissionById(id: string): Promise<ISubmission | null>;
  getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
  deleteSubmissionById(id: string): Promise<boolean>;
  updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
  getSubmissionDataByService(id: string): Promise<any>;
}

/**
 * Canonical domain transitions
 */
const allowedTransitions: Record<SubmissionStatus, SubmissionStatus[]> = {
    [SubmissionStatus.PENDING]: [SubmissionStatus.ATTEMPTED],
    [SubmissionStatus.ATTEMPTED]: [SubmissionStatus.COMPLETED],
    [SubmissionStatus.COMPLETED]: [],
  };

/**
 * Normalize DB value -> domain enum
 */
function normalizeStatus(rawStatus: string): SubmissionStatus | null {
  const upper = rawStatus.toUpperCase();
  return Object.values(SubmissionStatus).includes(upper as SubmissionStatus)
    ? (upper as SubmissionStatus)
    : null;
}

export class SubmissionService implements ISubmissionService {
  private submissionRepository: ISubmissionRepository;

  constructor(submissionRepository: ISubmissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async createSubmission(submission: Partial<ISubmission>): Promise<ISubmission> {
    if (!submission.problemId) throw new BadRequestError("Problem ID is required");
    if (!submission.code) throw new BadRequestError("Code is required");
    if (!submission.language) throw new BadRequestError("Programming language is required");
    if (!submission.userId) throw new BadRequestError("User ID is required");

    const correlationId = getCorrelationId();
    logger.info("Getting problem by ID", { problemId: submission.problemId, correlationId });

    const problem = await getProblemById(submission.problemId);
    if (!problem) throw new NotFoundError("Problem not found");

    const newSubmission = await this.submissionRepository.createSubmission(submission);

    await publishSubmissionCreated({
      submissionId: newSubmission._id.toString(),
      problem,
      code: newSubmission.code,
      language: newSubmission.language,
      userId: "",
      createdAt: "",
      traceId: correlationId,
    });

    logger.info("Published submission created event", {
      submissionId: newSubmission._id.toString(),
      correlationId,
    });

    return newSubmission;
  }

  async getSubmissionById(id: string): Promise<ISubmission | null> {
    const submission = await this.submissionRepository.findbySubmissionId(id);
    if (!submission) throw new NotFoundError("Submission not found");
    return submission;
  }

  async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
    return this.submissionRepository.findSubmissionbyProblemId(problemId);
  }

  async deleteSubmissionById(id: string): Promise<boolean> {
    const result = await this.submissionRepository.deleteById(id);
    if (!result) throw new NotFoundError("Submission not found");
    return result;
  }

  /**
   * ✅ IDEMPOTENT + SAFE
   */
  async updateSubmissionStatus(
    id: string,
    incomingStatus: SubmissionStatus
  ): Promise<ISubmission | null> {

    logger.info("[SUB][SERVICE] updateSubmissionStatus called", {
      submissionId: id,
      incomingStatus,
    });

    const submission = await this.submissionRepository.findbySubmissionId(id);
    if (!submission) throw new NotFoundError("Submission not found");

    const normalizedCurrentStatus = normalizeStatus(submission.status);

    // 🚨 Bad DB data — log & NO-OP (never crash consumer)
    if (!normalizedCurrentStatus) {
      logger.error("[SUB][BUG] Unknown submission status in DB", {
        submissionId: id,
        rawStatus: submission.status,
      });
      return submission;
    }

    const transitions = allowedTransitions[normalizedCurrentStatus];

    // 🔐 IDEMPOTENT NO-OP
    if (!transitions.includes(incomingStatus)) {
      logger.warn("[SUB][IDEMPOTENT] Status update ignored", {
        submissionId: id,
        currentStatus: normalizedCurrentStatus,
        incomingStatus,
      });
      return submission;
    }

    logger.info("[SUB][STATE-CHANGE] Updating submission status", {
      submissionId: id,
      from: normalizedCurrentStatus,
      to: incomingStatus,
    });

    return this.submissionRepository.updateSubmissionStatus(id, incomingStatus);
  }

  async getSubmissionDataByService(id: string): Promise<any> {
    const submissionData = await this.submissionRepository.getSubmissionDataRep(id);
    if (!submissionData) throw new NotFoundError("Submission not found");
    return submissionData;
  }
}
