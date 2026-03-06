export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}



//For getSubmissionsByProblemId which also returns TotalSubmissions for that problem

export interface PaginatedResponse<T> extends ApiResponse<T> {

    totalSubmission?: number;
}