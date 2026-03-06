//Language Enum 
export enum SubmissionLanguage {
    JavaScript = 'javascript',
    Python = 'python',
    Java = 'java',
    CSharp = 'csharp',
    Ruby = 'ruby',
    Go = 'go',
    CPlusPlus = 'cpp',
    TypeScript = 'typescript',
    PHP = 'php'
}


//Status Enum 
export enum SubmissionStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    SUCCESS = 'success',
    FAILED = 'failed',
    COMPILING = 'compiling',
    WRONG_ANSWER = 'wrong_answer',

}


//Submission Object 
export interface Submission {
    _id: string,
    problemId: string,
    code: string,
    language: SubmissionLanguage,
    status: SubmissionStatus,
    submissionData?: any,
    createdAt? : string,
    updatedAt? : string
 
}

//Request Payload for POST /api/submit 

export interface CreateSubmissionDTO{
    problemId: string, 
    code: string,
    language: SubmissionLanguage
}