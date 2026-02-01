import dotenv from 'dotenv';


type ServerConfig = {
    port: number;
    JWT_SECRET?: string;
    REDIS_URL?: string;
    REDIS_PORT: number;
    REDIS_RETRIES_PER_REQUEST:  number;
    PROBLEM_SERVICE_URL?: string;
    SUBMISSION_SERVICE_URL?: string;
}

function loadConfig(){
    dotenv.config();

    console.log(`Environment Variables Loaded`);
}

loadConfig();


export const serverConfig: ServerConfig = {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    JWT_SECRET: process.env.JWT_SECRET || "codexflow-secret",
    REDIS_URL: process.env.REDIS_URL || "127.0.0.1",
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    REDIS_RETRIES_PER_REQUEST: process.env.REDIS_RETRIES_PER_REQUEST ? parseInt(process.env.REDIS_RETRIES_PER_REQUEST) : 5,
    PROBLEM_SERVICE_URL: process.env.PROBLEM_SERVICE_URL || "http://localhost:4000",
    SUBMISSION_SERVICE_URL: process.env.SUBMISSION_SERVICE_URL || "http://localhost:5000",
};