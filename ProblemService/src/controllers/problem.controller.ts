import { Request, Response } from "express";
import { IProblemService } from "../services/problem.service";
import { sendResponse } from "../utils/response/sendResponse";

export interface IProblemController {
  createProblem(req: Request, res: Response): Promise<void>;
  getProblemById(req: Request, res: Response): Promise<void>;
  getAllProblems(req: Request, res: Response): Promise<void>;
  updateProblem(req: Request, res: Response): Promise<void>;
  deleteProblem(req: Request, res: Response): Promise<void>;
  findByDifficulty(req: Request, res: Response): Promise<void>;
  searchProblems(req: Request, res: Response): Promise<void>;
}


export class ProblemController implements IProblemController {
  constructor(private readonly problemService: IProblemService) {}


  /**
   * 
   * @param req 
   * @param res 
   * 
   */
  async createProblem(req: Request, res: Response): Promise<void> {
    const problem = await this.problemService.createProblem(req.body);
    sendResponse(res, 201, "Problem created successfully", problem);
  }


  /**
   * 
   * @param req 
   * @param res     
   * @returns problem by id
  */
  async getProblemById(req: Request, res: Response): Promise<void> {
    const problem = await this.problemService.getProblemById(req.params.id);
    sendResponse(res, 200, "Problem fetched successfully", problem);
  }

  /**
   * 
   * @param _req 
   * @param res 
   * @returns list of all problems
   */
  async getAllProblems(_req: Request, res: Response): Promise<void> {
    const problems = await this.problemService.getAllProblems();
    sendResponse(res, 200, "Problems fetched successfully", problems);
  }


  /**
   * 
   * @param req 
   * @param res 
   * @returns updated problem
   */
  async updateProblem(req: Request, res: Response): Promise<void> {
    const problem = await this.problemService.updateProblem(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, "Problem updated successfully", problem);
  }


  /**
   * 
   * @param req 
   * @param res 
   * @returns deletion status
   */
  async deleteProblem(req: Request, res: Response): Promise<void> {
    await this.problemService.deleteProblem(req.params.id);
    sendResponse(res, 200, "Problem deleted successfully", true);
  }


  /**
   * 
   * @param req 
   * @param res 
   * @returns list of problems matching the difficulty
   */
async findByDifficulty(req: Request, res: Response): Promise<void> {
    const difficulty = req.params.difficulty as "easy" | "medium" | "hard";
    if (this.problemService.findByDifficulty) {
        const problems = await this.problemService.findByDifficulty(difficulty);
        sendResponse(res, 200, "Problems fetched successfully", problems);
    } else {
        sendResponse(res, 500, "Problem service not available", null);
    }
}


/**
 * 
 * @param req 
 * @param res 
 * @returns list of problems matching the search query
 */
async searchProblems(req: Request, res: Response): Promise<void> {
    if (this.problemService.searchProblems) {
        const problems = await this.problemService.searchProblems(
            req.query.query as string
        );
        sendResponse(res, 200, "Problems fetched successfully", problems);
    } else {
        sendResponse(res, 500, "Problem service not available", null);
    }
}
}
