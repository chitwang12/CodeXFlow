import { IProblemRepository } from "../repositories/problem.repository";
import { IProblem } from "../models/problem.model";
import { CreateProblemDto, UpdateProblemDto } from "../validators/problem.validator";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/helpers/markdown.sanitize";

/**
 * Explicit difficulty types
 */
type DifficultyDTO = "easy" | "medium" | "hard";
type DifficultyDomain = "Easy" | "Medium" | "Hard";

/**
 * Canonical mapping
 */
const difficultyMap: Record<DifficultyDTO, DifficultyDomain> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/**
 * Safe mapper function
 */
function mapDifficulty(difficulty: DifficultyDTO): DifficultyDomain {
  return difficultyMap[difficulty];
}

export interface IProblemService {
  createProblem(problem: CreateProblemDto): Promise<IProblem>;
  getProblemById(id: string): Promise<IProblem>;
  getAllProblems(): Promise<IProblem[]>;
  updateProblem(id: string, problem: UpdateProblemDto): Promise<IProblem | null>;
  deleteProblem(id: string): Promise<boolean>;
  findByDifficulty(difficulty: DifficultyDTO): Promise<IProblem[]>;
  searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService {
  constructor(private readonly problemRepository: IProblemRepository) {}

  async createProblem(problem: CreateProblemDto): Promise<IProblem> {
    const payload: Partial<IProblem> = {
      title: problem.title,
      description: await sanitizeMarkdown(problem.description),
      editorial: problem.editorial
        ? await sanitizeMarkdown(problem.editorial)
        : undefined,
      difficulty: mapDifficulty(problem.difficulty),
      testcases: problem.testcases,
    };

    return this.problemRepository.createProblem(payload);
  }

  async getProblemById(id: string): Promise<IProblem> {
    const problem = await this.problemRepository.getProblemById(id);
    if (!problem) {
      throw new NotFoundError("Problem not found");
    }
    return problem;
  }

  async getAllProblems(): Promise<IProblem[]> {
    return this.problemRepository.getAllProblems();
  }

  async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
    const existing = await this.problemRepository.getProblemById(id);
    if (!existing) {
      throw new NotFoundError("Problem not found");
    }

    const payload: Partial<IProblem> = {};

    if (updateData.title) payload.title = updateData.title;

    if (updateData.description) {
      payload.description = await sanitizeMarkdown(updateData.description);
    }

    if (updateData.editorial) {
      payload.editorial = await sanitizeMarkdown(updateData.editorial);
    }

    if (updateData.difficulty) {
      payload.difficulty = mapDifficulty(updateData.difficulty);
    }

    if (updateData.testcases) {
      payload.testcases = updateData.testcases;
    }

    return this.problemRepository.updateProblem(id, payload);
  }

  async deleteProblem(id: string): Promise<boolean> {
    const deleted = await this.problemRepository.deleteProblem(id);
    if (!deleted) {
      throw new NotFoundError("Problem not found");
    }
    return true;
  }

  async findByDifficulty(difficulty: DifficultyDTO): Promise<IProblem[]> {
    const problems = await this.problemRepository.findByDifficulty(
      mapDifficulty(difficulty)
    );

    if (problems.length === 0) {
      throw new NotFoundError("No problems found");
    }

    return problems;
  }

  async searchProblems(query: string): Promise<IProblem[]> {
    if (!query || query.trim() === "") {
      throw new BadRequestError("Search query cannot be empty");
    }
    return this.problemRepository.searchProblems(query);
  }
}
