import { CreateProblemDto, UpdateProblemDto } from "../validators/problem.validator";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repositories/problem.repository";
import { BadRequestError, NotFoundError } from "../utils/errors/app.error";
import { sanitizeMarkdown } from "../utils/helpers/markdown.sanitize"
import logger from "../config/logger.config";




export interface IProblemService {
    createProblem(problem: CreateProblemDto): Promise<IProblem>;
    getProblemById(id: string): Promise<IProblem>;
    getAllProblems(): Promise<IProblem[]>;
    updateProblem(id: string, problem: UpdateProblemDto): Promise<IProblem | null>;
    deleteProblem(id: string): Promise<boolean>;
    findByDifficulty?(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]>;
    searchProblems(query: string): Promise<IProblem[]>;
}


export class ProblemService implements IProblemService {
    private problemRepository: IProblemRepository;

    constructor(problemRepository: IProblemRepository) {
        this.problemRepository = problemRepository;
    }


    /**
     * 
     * @param problem 
     * @returns 
     */
    async createProblem(problem: CreateProblemDto): Promise<IProblem> {

        //Sanitize the markdown 
        const sanitizedPayLoad = {
            ...problem,
            description: await sanitizeMarkdown(problem.description),
            editorial: problem.editorial && await sanitizeMarkdown(problem.editorial || '')
        }
        return await this.problemRepository.createProblem(sanitizedPayLoad);
    }


    /**
     * 
     * @param id 
     * @returns problem
     */
    async getProblemById(id: string): Promise<IProblem> {
        const problem = await this.problemRepository.getProblemById(id);
        if(!problem){
            throw new NotFoundError('Problem not found');
        } 
        logger.info(`Problem retrieved with ID: ${id}`);
        return problem;
    }

    /**
     * 
     * @returns all problems
     */
    async getAllProblems(): Promise<IProblem[]> {
        return await this.problemRepository.getAllProblems();
    }


    /**
     * 
     * @param id 
     * @param problem 
     * @returns updated problem
     */
    async updateProblem(id: string, updateData: UpdateProblemDto): Promise<IProblem | null> {
        const problem = await this.problemRepository.getProblemById(id);

        if(!problem) {
            throw new NotFoundError("Problem not found");
        }

        const sanitizedPayload: Partial<IProblem> = {
            ...updateData
        }
        if(updateData.description) {
            sanitizedPayload.description = await sanitizeMarkdown(updateData.description);
        }

        if(updateData.editorial) {
            sanitizedPayload.editorial = await sanitizeMarkdown(updateData.editorial);
        }

        return await this.problemRepository.updateProblem(id, sanitizedPayload);
    }

    /**
     * 
     * @param id 
     * @returns 
     */

    async deleteProblem(id: string): Promise<boolean> {
        const deleted = await this.problemRepository.deleteProblem(id);
        if(!deleted){
            throw new NotFoundError('Problem not found for deletion');
        } else {
            logger.info(`Problem deleted with ID: ${id}`);
        }
        return deleted;
    }

    /**
     * 
     * @param difficulty
     * @returns problems by difficulty
     */

    async findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]> {
        const problems = await this.problemRepository.findByDifficulty!(difficulty);
        if(problems.length === 0){
            throw new NotFoundError(`No problems found with difficulty: ${difficulty}`);
        }
        return problems;
    }

    /**
     * 
     * @param query
     * @returns searched problems
     * 
     */
    async searchProblems(query: string): Promise<IProblem[]> {
        if(!query || query.trim() === ''){
            throw new BadRequestError('Search query cannot be empty');
        }

        return await this.problemRepository.searchProblems(query);
    }
}
