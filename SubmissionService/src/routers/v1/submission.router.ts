import { Router } from 'express';
import { SubmissionController } from '../../controllers/submission.controller';
import { SubmissionService } from '../../services/submission.service';
import { SubmissionRepository } from '../../repository/submission.repository';
import { validateParams, validateRequestBody } from '../../validators/';
import {
  createSubmissionSchema,
  updateSubmissionStatusSchema,
  submissionIdParamSchema,
  problemIdParamSchema
} from '../../validators/submission.validator';
const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);

const {
  createSubmission,
  getSubmissionById,
  getSubmissionsByProblemId,
  updateSubmissionStatus,
  deleteSubmissionById,
  getSubmissionData,
} = new SubmissionController(submissionService);

const submissionRouter = Router();

// Create a submission
submissionRouter.post(
  "/create",
  validateRequestBody(createSubmissionSchema),
  createSubmission
);

// Get submissions by problem ID
submissionRouter.get(
  "/problem/:problemId",
  validateParams(problemIdParamSchema),
  getSubmissionsByProblemId
);

// Get submission data (code, results, etc.)
submissionRouter.get(
  "/:id/data",
  getSubmissionData
);

// Update submission status
submissionRouter.patch(
  "/:id/status",
  validateRequestBody(updateSubmissionStatusSchema),
  updateSubmissionStatus
);

// Delete submission by ID
submissionRouter.delete(
  "/:id",
  deleteSubmissionById
);

// Get submission by ID 
submissionRouter.get(
  "/:id",
  validateParams(submissionIdParamSchema),
  getSubmissionById
);

export default submissionRouter;