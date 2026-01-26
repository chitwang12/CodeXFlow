import axios, { AxiosInstance } from "axios";
import logger from "../config/logger.config";
import { serverConfig } from "../config";
import { InternalServerError, NotFoundError } from "../utils/errors/app.error";
import { retry } from "../utils/helpers/retry";

export interface ITestCase {
    input: string;
    output: string;
}

export interface IProblemDetails {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    editorial?: string;
    tags: string[];
    testcases: ITestCase[];
    created_at: Date;
    updated_at: Date;
}

export interface IProblemResponse {
    success: boolean;
    message: string;
    data: IProblemDetails;
}

const problemServiceLogger = logger.child({
    service: "ProblemServiceClient",
});

const problemClient: AxiosInstance = axios.create({
    baseURL: serverConfig.Problem_Service,
    timeout: 3000,
});

export async function getProblemById(
    problemId: string
): Promise<IProblemDetails> {
    return retry(
        async () => {
            const response = await problemClient.get<IProblemResponse>(
                `/problems/${problemId}`
            );

            if (!response.data.success) {
                throw new InternalServerError(
                    "Problem service returned unsuccessful response"
                );
            }

            return response.data.data;
        },
        {
            retries: 2,
            delayMs: 200,
            shouldRetry: (err) => {
                if (axios.isAxiosError(err)) {
                    if (err.response?.status === 404) {
                        throw new NotFoundError("Problem not found");
                    }
                    return !err.response || err.response.status >= 500;
                }
                return false;
            },
        }
    ).catch((err) => {
        if (axios.isAxiosError(err)) {
            problemServiceLogger.error(
                "Problem service request failed",
                {
                    status: err.response?.status,
                    problemId,
                }
            );
            
        }
        throw err;
    });
}
