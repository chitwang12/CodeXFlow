import { z } from "zod";

export const createProblemSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty: z.enum(["easy", "medium", "hard"]),
    tags: z.array(z.string()).optional(),
    editorial: z.string().optional(),
    testcases: z.array(
        z.object({
          input: z.string().trim().min(1, "Test case input is required"),
          output: z.string().trim().min(1, "Test case output is required")
        })
      ).min(1, "At least one test case is required")
  });
  

export const updateProblemSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    editorial: z.string().optional(),
    testcases: z.array(z.object({
        input: z.string().min(1),
        output: z.string().min(1)
    })).optional()
})

export const findByDifficultySchema = z.object({
    difficulty: z.enum(["easy", "medium", "hard"])
});

export type CreateProblemDto= z.infer<typeof createProblemSchema>;
export type UpdateProblemDto = z.infer<typeof updateProblemSchema>;