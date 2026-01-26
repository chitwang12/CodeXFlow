import { Router } from 'express';
import { SubmissionController } from '../../controllers/submission.controller';
import { SubmissionService } from '../../services/submission.service';
import { SubmissionRepository } from '../../repository/submission.repository';
import { validateQueryParams, validateRequestBody } from '../../validators/';
import { 
    createSubmissionSchema, 
    updateSubmissionStatusSchema,
    submissionIdParamSchema 
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
    validateQueryParams,
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
  
  // Get submission by ID (LAST — most generic)
  submissionRouter.get(
    "/:id",
    validateQueryParams(submissionIdParamSchema),
    getSubmissionById
  );
  
export default submissionRouter;