import { IProblemDetails } from "../api/problem.client";

export interface SubmissionCreatedEvent {
    submissionId: string;
    problem: IProblemDetails;
    language: string;
    code: string;
    userId: string;
    createdAt: string;
}
