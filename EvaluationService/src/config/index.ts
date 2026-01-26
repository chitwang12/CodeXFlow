// This file contains all the basic configuration logic for the app server to work
import dotenv from 'dotenv';

type ServerConfig = {
    PORT: number, 
    DB_URL: string,
    RabbitMQ_URL?: string,
    RabbitMQ_QUEUE_NAME?: string,
    RabbitMQ_EXCHANGE_NAME?: string;
    RabbitMQ_ROUTING_KEY?: string;
}

function loadEnv() {
    dotenv.config();
    console.log(`Environment variables loaded`);
}

loadEnv();

export const serverConfig: ServerConfig = {
    PORT: Number(process.env.PORT) || 3001,
    DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/myapp',
    RabbitMQ_URL: process.env.RABBITMQ_URL || 'amqp://localhost',
    RabbitMQ_EXCHANGE_NAME: process.env.RABBITMQ_EXCHANGE_NAME || "submission.exchange",
    RabbitMQ_ROUTING_KEY: process.env.RABBITMQ_ROUTING_KEY || "submission.created",
    RabbitMQ_QUEUE_NAME: process.env.RABBITMQ_QUEUE_NAME || 'submissions_queue',
};