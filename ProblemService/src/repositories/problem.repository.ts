import { IProblem, ProblemModel } from "../models/problem.model";
import logger from "../config/logger.config";

export interface IProblemRepository {
    createProblem(problem: Partial<IProblem>): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem | null>;
    getAllProblems(): Promise<IProblem[]>;
    updateProblem(
      id: string,
      updateData: Partial<IProblem>
    ): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]>;
    searchProblems(query: string): Promise<IProblem[]>;
  }

export class ProblemRepository implements IProblemRepository {

    async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
        const newProblem = await ProblemModel.insertOne({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: problem.tags || [],
            editorial: problem.editorial ,
            testcases: problem.testcases || []
        });
        logger.info(`Problem created with ID: ${newProblem._id}`);
        return newProblem;
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        return await ProblemModel.findById(id).exec();
      }      

    async getAllProblems(): Promise<IProblem[]> {
        const allProblems = await ProblemModel.find();
        logger.info(`Retrieved ${allProblems.length} problems from the database`);
        return allProblems;
    }

    async updateProblem(id: string, problem: Partial<IProblem>): Promise<IProblem | null> {
        return await ProblemModel.findByIdAndUpdate(id, problem, { new: true }).exec();
    }

    async deleteProblem(id: string): Promise<boolean> {
        const result = await ProblemModel.findByIdAndDelete(id).exec();
        return result ? true : false;
    }
    
    async findByDifficulty(difficulty: "Easy" | "Medium" | "Hard"): Promise<IProblem[]> {
        return ProblemModel.find({ difficulty });
    }


    async searchProblems(query: string): Promise<IProblem[]> {
        return await ProblemModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }).sort({createdAt: -1});
    }
}
