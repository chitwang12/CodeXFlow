import { Document, Schema, model } from "mongoose";

export enum SubmissionStatus {
    COMPLETED = "completed",
    PENDING = "pending",
    ATTEMPTED = "attempted",
}

export enum SubmissionLanguage {
    CPP = "cpp",
    PYTHON = "python",
}

export interface ISubmissionData {
    testCaseId: string;
    status: string;
}
export interface ISubmission extends Document {
    problemId: string;
    code: string;
    userId: string
    language: SubmissionLanguage;
    status: SubmissionStatus;
    submissionData: ISubmissionData;
    createdAt: Date;
    updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
    problemId: { 
        type: String, 
        required: [true, "Problem Id required for the submission"] 
    },
    code: { 
        type: String, 
        required: [true, "Code is required for evaluation"] 
    },
    userId: {
        type: String,
        required: [true, "User Id is required for submission"]
    },
    language: { 
        type: String, 
        required: [true, "Language is required for evaluation"],
        enum: Object.values(SubmissionLanguage)
    },
    status: { 
        type: String, 
        required: true, 
        default: SubmissionStatus.PENDING,
        enum: Object.values(SubmissionStatus)
    },
    submissionData: {
        type: Object,
        required: true,
        default: {}
    }
}, {
    timestamps: true,
    toJSON: {
        transform: (_doc, ret) => {
            const obj = ret as any;
    
            obj.id = obj._id.toString();
            delete obj._id;
            delete obj.__v;
    
            return obj;
        }
    }
    
});

submissionSchema.index({ status: 1, createdAt: -1 });

export const Submission = model<ISubmission>("Submission", submissionSchema);