import { Request, Response } from "express";
import { IProblemService } from "../services/problem.service";
import { sendResponse } from "../utils/response/sendResponse";

export class ProblemController {
  constructor(private readonly problemService: IProblemService) {}

  createProblem = async (req: Request, res: Response): Promise<void> => {
    const problem = await this.problemService.createProblem(req.body);
    sendResponse(res, 201, "Problem created successfully", problem);
  };

  getProblemById = async (req: Request, res: Response): Promise<void> => {
    const problem = await this.problemService.getProblemById(req.params.id);
    sendResponse(res, 200, "Problem fetched successfully", problem);
  };

  getAllProblems = async (_req: Request, res: Response): Promise<void> => {
    const problems = await this.problemService.getAllProblems();
    sendResponse(res, 200, "Problems fetched successfully", problems);
  };

  updateProblem = async (req: Request, res: Response): Promise<void> => {
    const problem = await this.problemService.updateProblem(
      req.params.id,
      req.body
    );
    sendResponse(res, 200, "Problem updated successfully", problem);
  };

  deleteProblem = async (req: Request, res: Response): Promise<void> => {
    await this.problemService.deleteProblem(req.params.id);
    sendResponse(res, 200, "Problem deleted successfully", true);
  };

  findByDifficulty = async (req: Request, res: Response): Promise<void> => {
    const difficulty = req.params.difficulty as "easy" | "medium" | "hard";
    const problems = await this.problemService.findByDifficulty(difficulty);
    sendResponse(res, 200, "Problems fetched successfully", problems);
  };

  searchProblems = async (req: Request, res: Response): Promise<void> => {
    const query = req.query.q as string;
    const problems = await this.problemService.searchProblems(query);
    sendResponse(res, 200, "Problems fetched successfully", problems);
  }
}
