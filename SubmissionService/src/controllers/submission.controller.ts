import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";
import { SubmissionService } from "../services/submission.service";

export class SubmissionController {
        // Controller methods would go here

        private submissionService: SubmissionService;

        constructor(submissionService: SubmissionService) {
            this.submissionService = submissionService;
        }

        createSubmission = async (req: Request, res: Response, next: NextFunction) => {
            logger.info("Create submission request received", { body: req.body });

            const submissionData = await this.submissionService.createSubmission(req.body);

            logger.info("Submission created successfully", { submissionId: submissionData._id });

            res.status(201).json({
                success: true,
                message: "Submission created successfully",
                data: submissionData,
            })
        };


        getSubmissionById = async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            logger.info("Get submission by ID request received", { submissionId: id });

            const submission = await this.submissionService.getSubmissionById(id as string);
            
            logger.info("Fetched submission successfully", { submissionId: id });

            res.status(200).json({
                success: true,
                message: "Submission fetched successfully",
                data: submission, 
            });
        };


        getSubmissionsByProblemId = async (req: Request, res: Response, next: NextFunction) => {
            const { problemId } = req.params;
            logger.info("Get submissions by Problem ID request received", { problemId });

            const submissions = await this.submissionService.getSubmissionsByProblemId(problemId as string);

            logger.info(`Fetched total ${submissions.length} submissions successfully for ${problemId}`);

            res.status(200).json({
                success: true,
                message: "Submissions fetched successfully",
                TotalSubmissions: submissions.length,
                data: submissions,
            });
        };


        deleteSubmissionById = async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            logger.info("Delete submission by ID request received", { submissionId: id });

            await this.submissionService.deleteSubmissionById(id as string);

            logger.info("Deleted submission successfully", { submissionId: id });

            res.status(200).json({
                success: true,
                message: "Submission deleted successfully",
            });
        };


        updateSubmissionStatus = async (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            const { status } = req.body;
            logger.info("Update submission status request received", { submissionId: id, status });

            const updatedSubmission = await this.submissionService.updateSubmissionStatus(id as string, status);

            logger.info("Updated submission status successfully", { submissionId: id, status });

            res.status(200).json({
                success: true,
                message: "Submission status updated successfully",
                data: updatedSubmission,
            });
        };


         getSubmissionData = async (req:Request, res:Response, next:NextFunction) => {
            const { id } = req.params;
            logger.info("Get submission data request received", { submissionId: id });

            const submissionData = await this.submissionService.getSubmissionDataByService(id as string);

            logger.info("Fetched submission data successfully", { submissionId: id });

            res.status(200).json({
                success: true,
                message: "Submission data fetched successfully",
                data: submissionData,
            });
            
        };
}