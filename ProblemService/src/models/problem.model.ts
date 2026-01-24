import mongoose from  'mongoose';


export interface ITestCase{
    input: string;
    output: string;
}
export interface IProblem extends mongoose.Document {
    title: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
    editorial?: string;
    testcases : ITestCase[];
} 


const TestCaseSchema = new mongoose.Schema<ITestCase>({
    input: {
        type: String,
        required: [true, 'Test case input is required'],
        trim: true
    },
    output: {
        type: String,
        required: [true, 'Test case output is required'],
        trim: true
    }
})
const problemSchema = new mongoose.Schema<IProblem>({
    title: {
        type: String,
        required: [true, 'Problem title is required'],
        unique: true,
        maxLength: [100, 'Title cannot exceed 100 characters'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Problem description is required'],
        trim: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, 'Problem difficulty is required']
    },
    tags: {
        type: [String],
        default: []
    },
    editorial: {
        type: String,
        default: ''
    },
    testcases:{
        type: [TestCaseSchema],
        required: [true, 'At least one test case is required'],
        validate: {
            validator: function(v: ITestCase[]) {
                return v.length > 0;
            },
            message: 'There must be at least one test case'
        }
    }, 
},{ 
        timestamps: true
    });

//Indexes 
problemSchema.index({ title: 1 }, { unique: true });
problemSchema.index({ tags: 1 });
problemSchema.index({ difficulty: 1 });


export const ProblemModel = mongoose.model<IProblem>('Problem', problemSchema);