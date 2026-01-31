import { model, Schema } from "mongoose";

export interface IEvaluationExecution {
  submissionId: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  traceId: string;
  startedAt: Date;
  completedAt?: Date;
  failureReason?: string;
}

const EvaluationExecutionSchema = new Schema<IEvaluationExecution>(
  {
    submissionId: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: ["PROCESSING", "COMPLETED", "FAILED"],
      required: true,
    },
    traceId: { type: String, required: true },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    failureReason: { type: String },
  },
  { timestamps: true }
);

EvaluationExecutionSchema.index(
  { submissionId: 1 },
  { unique: true }
);

export const EvaluationExecutionModel = model(
  "EvaluationExecution",
  EvaluationExecutionSchema
);
