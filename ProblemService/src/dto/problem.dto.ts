import { ITestCase } from "../models/problem.model";

export interface CreateProblemDTO {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags?: string[];
    editorial?: string;
    testcases: ITestCase[];
}

export interface UpdateProblemDTO {
    title?: string;
    description?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    tags?: string[];
    editorial?: string;
    testcases?: ITestCase[];
}