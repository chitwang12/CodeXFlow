import {SubmissionStatus as DomainSubmissionStatus } from "../../models/submission.model";
import { SubmissionStatus } from "../../messaging/events";


export function mapEvaluatedToDomainStatus(status: SubmissionStatus): DomainSubmissionStatus {
    switch (status) {
        case "completed":
          return DomainSubmissionStatus.COMPLETED;
        case "attempted":
          return DomainSubmissionStatus.ATTEMPTED;
        case "failed":
          return DomainSubmissionStatus.COMPLETED; 
          // completed lifecycle, but failed result
        default:
          throw new Error(`Unknown evaluated status: ${status}`);
      }
}

