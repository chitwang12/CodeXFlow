import express from "express";
import { ProblemController } from "../../controllers/problem.controller";
import { validateRequestBody, validateRequestParams } from "../../validators";
import { createProblemSchema, findByDifficultySchema, updateProblemSchema} from "../../validators/problem.validator";
import { ProblemService } from "../../services/problem.service"; // Adjust the import path as necessary
import { ProblemRepository } from "../../repositories/problem.repository";
const problemRepositoryInstance = new ProblemRepository(); // Create an instance of ProblemRepository
const problemServiceInstance = new ProblemService(problemRepositoryInstance); // Create an instance of ProblemService with the repository
const {
    createProblem: createProblemHandler,
    getProblemById: getProblemHandler,
    getAllProblems: getAllProblemsHandler,
    updateProblem: updateProblemHandler,
    deleteProblem: deleteProblemHandler,
    findByDifficulty: findByDifficultyHandler,
    searchProblems: searchProblemHandler,
} = new ProblemController(problemServiceInstance); // Pass the instance here

const problemRouter = express.Router();


/**
 * * Problem Route
 * * @route /api/v1/problems
 * EndPoitn Details for Creating a Problem
 * * @method POST
 * * @access PUBLIC
 * 
 * Sample Request Body:
 * * {
 *    "title": "Two Sum",
 *   "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
 *   "difficulty": "Easy",
 *   "tags": ["Array", "Hash Table"],
 *   "editorial": "To solve the Two Sum problem, we can use a hash map to store the indices of the numbers we have seen so far...",
 *   "testcases": [
 *     {
 *       "input": "nums = [2,7,11,15], target = 9",
 *      "output": "[0,1]"
 * },
 *    {
 *      "input": "nums = [3,2,4], target = 6",
 *     "output": "[1,2]"
 *   }
 * ]
 * }
 * @returns Created Problem Object
 * 
 */
problemRouter.post(
    "/create",
    validateRequestBody(createProblemSchema),
    createProblemHandler
);


/**
 * * EndPoint Details for Getting Problems
 * * @route /api/v1/problems
 * * @method GET
 * * @access PUBLIC
 * *
 * @returns List of Problems
 * 
 */
problemRouter.get("/", getAllProblemsHandler);

/**
 * * EndPoint Details for Searching Problems
 * * * @route /api/v1/problems/search
 * * * @method GET
 * * * @access PUBLIC
 * *
 * @returns List of Problems matching the search query
 * 
 */
problemRouter.get("/search", searchProblemHandler);

/**
 * 
 * 
 * * EndPoint Details for Getting Problems by Difficulty
 *  * * @route /api/v1/problems/difficulty/:difficulty
 * * * @method GET
 * * * @access PUBLIC
 *  * @returns List of Problems matching the difficulty
 */
problemRouter.get(
    "/difficulty/:difficulty",
    validateRequestParams(findByDifficultySchema),
    findByDifficultyHandler
  );


/**
 * 
 * * EndPoint Details for Getting a Problem by ID
 * * * @route /api/v1/problems/:id
 * * * @method GET
 * * * @access PUBLIC
 * * @returns Problem Object
 * 
 */
problemRouter.get("/:id", getProblemHandler);


/**
 * 
 * * EndPoint Details for Updating a Problem
 * * * @route /api/v1/problems/:id
 * * * @method PUT
 * * * @access PUBLIC
 * * Sample Request Body:
 * * {
 *   "title": "Two Sum Updated",
 *  "description": "Updated description for Two Sum problem.",
 *  "difficulty": "Medium",
 *  "tags": ["Array", "Hash Table", "UpdatedTag"],
 * "editorial": "Updated editorial content for Two Sum problem...",
 * "testcases": [
 *   {
 *    "input": "nums = [1,2,3,4], target = 5",
 *   "output": "[0,3]"
 *  },
 *  {
 *    "input": "nums = [5,6,7,8], target = 13",
 *   "output": "[0,2]"
 *  }
 * ]
 * }
 * * @returns Updated Problem Object
 * 
 */
problemRouter.patch(
  "/:id",
  validateRequestBody(updateProblemSchema),
  updateProblemHandler
);
problemRouter.delete("/:id", deleteProblemHandler);


export default problemRouter;