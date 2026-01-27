import { ISubmission, SubmissionStatus, Submission } from '../models/submission.model';
import  logger  from "../config/logger.config"

export interface ISubmissionRepository {

    createSubmission(submission: Partial<ISubmission>): Promise<ISubmission>;
    findbySubmissionId(id: string): Promise<ISubmission | null>;
    findSubmissionbyProblemId(problemId: string): Promise<ISubmission[]>;
    deleteById(id: string): Promise<boolean>;
    updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null>;
    getSubmissionDataRep(id: string): Promise<ISubmission | null>;
}

export class SubmissionRepository implements ISubmissionRepository{
    
    
    async createSubmission(submission: Partial<ISubmission>): Promise<ISubmission> {
        const newSubmission = await Submission.create(submission);
        logger.info(`New submission created with ID: ${newSubmission._id}`);
        return await newSubmission.save();
    }

    async findbySubmissionId(id: string): Promise<ISubmission | null> {
        const submission = await Submission.findById(id);
        logger.info(`Fetched submission with ID: ${id}`);
        return submission;
    }

    async findSubmissionbyProblemId(problemId: string): Promise<ISubmission[]> {
        const submissions = await Submission.find({ problemId });
        logger.info(`Fetched submissions for Problem ID: ${problemId}`);
        return submissions;
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await Submission.deleteOne({ _id: id }).exec();
        logger.info(`Deleted submission with ID: ${id}`);
        return result !== null;
    }

    async updateSubmissionStatus(id: string, status: SubmissionStatus): Promise<ISubmission | null> {
        const updatedSubmission = await Submission.findByIdAndUpdate(id, { status }, { new: true });
        logger.info(`Updated submission status for ID: ${id} to ${status}`);
        return updatedSubmission;
    }

    async getSubmissionDataRep(id: string): Promise<ISubmission | null> {
        const result = await Submission.findOne({
            _id: id
        });

        return result;
    }
}