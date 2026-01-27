export interface SubmissionEvaluatedEvent {
  eventType: "SUBMISSION_EVALUATED";
  submissionId: string;
  submissionStatus: "completed" | "attempted" | "failed";
  testcaseResults: Record<string, string>;
  traceId?: string;
  evaluatedAt: string;
}
