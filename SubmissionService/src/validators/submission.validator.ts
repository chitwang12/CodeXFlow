import { z } from "zod";
import { SubmissionLanguage, SubmissionStatus } from "../models/submission.model";



//Schema for creating a new Submission
export const createSubmissionSchema = z.object({
    problemId: z.string().min(1, "Problem ID is required"),
    code: z.string().min(1, "Code cannot be empty"),
    language: z.nativeEnum(SubmissionLanguage, {
        errorMap: () => ({ message: "Invalid submission language" })
    })
});

//Schema for validating submissionStatus
export const updateSubmissionStatusSchema = z.object({
    status: z.nativeEnum(SubmissionStatus, {
        errorMap: () => ({ message: "Status must be one of: pending, compiling, running, accepted, wrong_answer" })
    }),
    submissionData: z.any()
});

// Checking for valid submission id in path parameters
export const submissionIdParamSchema = z.object({
  id: z.string().length(24, "Invalid submission id"),
});


// Schema for query parameters (if needed for filtering)
export const submissionQuerySchema = z.object({
    status: z.nativeEnum(SubmissionStatus).optional(),
    language: z.nativeEnum(SubmissionLanguage).optional(),
    limit: z.string().transform(val => parseInt(val)).pipe(z.number().min(1).max(100)).optional(),
    page: z.string().transform(val => parseInt(val)).pipe(z.number().min(1)).optional()
});

//Params schema Validation for problemId
export const problemIdParamSchema = z.object({
    problemId: z.string().length(24, "Invalid problem id"),
  });
