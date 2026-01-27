import { ISubmission, SubmissionStatus } from "../models/submission.model";
import { ISubmissionRepository } from "../repository/submission.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { getProblemById } from "../api/problem.client";
import logger from "../config/logger.config";
import { publishSubmissionCreated } from "../messaging/submission.publisher";
import { uuid } from "uuidv4";


export interface ISubmissionService {
    createSubmission(submission: Partial<ISubmission>): Promise<ISubmission>;
    getSubmissionById(id: string): Promise<ISubmission | null>;
    getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;
    deleteSubmissionById(id: string): Promise<boolean>;
    updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
    getSubmissionDataByService(id: string): Promise<any>;
}


export class SubmissionService implements ISubmissionService {
    private submissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async createSubmission(submission: Partial<ISubmission>): Promise<ISubmission> {
        
        //Todo 
        if(!submission.problemId){
            throw new BadRequestError('Problem ID is required');
        }

        if(!submission.code){
            throw new BadRequestError('Code is required');
        }

        if(!submission.language){
            throw new BadRequestError('Programming language is required');
        }

        if(!submission.userId){
            throw new BadRequestError('User ID is required');
        }

        logger.info("Getting problem by ID", { problemId: submission.problemId });
        
        //check if the problem id exists in the problem service , but How lets Make an API call with the Problem Service
        const problem = await getProblemById(submission.problemId);
        if(!problem){
            throw new NotFoundError('Problem not found');
        }

        // Store the submission in the Submission DB
        const newSubmission = await this.submissionRepository.createSubmission(submission);

        let traceId = uuid();
        //Submission to RabbitMq , for Async processing
        await publishSubmissionCreated({
            submissionId: newSubmission._id.toString(),
            problem,
            code: newSubmission.code,
            language: newSubmission.language,
            userId: "",
            createdAt: "",
            traceId: traceId

        });

        logger.info(`Published submission created event for Submission ID: ${newSubmission._id} with traceId ${traceId}`);
        return newSubmission;
    }



    async getSubmissionById(id: string): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.findbySubmissionId(id);
        if(!submission){
            throw new NotFoundError('Submission not found');
        }

        return submission
    }



    async getSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
        const submissions = await this.submissionRepository.findSubmissionbyProblemId(problemId);
        return submissions;
    }



    async deleteSubmissionById(id: string): Promise<boolean> {
        const result = await this.submissionRepository.deleteById(id);
        if(!result){
            throw new NotFoundError('Submission not found');
        }
        return result;
    }



    async updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null> {
        const submission = await this.submissionRepository.updateSubmissionStatus(id, status);
        if(!submission){
            throw new NotFoundError('Submission not found');
        }
        return submission
    }

    async getSubmissionDataByService(id: string): Promise<any> {
        const submissionData = await this.submissionRepository.getSubmissionDataRep(id);
        if(!submissionData){
            throw new NotFoundError('Submission not found');
        }
        return submissionData;
    }
}