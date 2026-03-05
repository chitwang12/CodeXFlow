export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {

  _id?: string;

  input: string;

  output: string;

}

export interface Problem {

  _id: string;

  title: string;

  description: string;

  difficulty: Difficulty;

  tags?: string[];

  editorial?: string;

  testcases: TestCase[];

  createdAt: string;

  updatedAt: string;

}