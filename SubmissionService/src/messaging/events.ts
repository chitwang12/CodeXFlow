import { IProblemDetails } from "../api/problem.client";

export interface SubmissionCreatedEvent {
    submissionId: string;
    problem: IProblemDetails;
    language: string;
    code: string;
    traceId?: string;
    userId: string;
    createdAt: string;
}



export interface SubmissionEvaluatedEvent{
  eventType: "SUBMISSION_EVALUATED";
  submissionId: string;
  submissionStatus: SubmissionStatus;
  testcaseResults: Record<string, string>;
  traceId?: string;
  evaluatedAt: string;
}

export type SubmissionStatus = "completed" | "attempted" | "failed";