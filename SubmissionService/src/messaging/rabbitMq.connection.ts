import { connect, Channel } from 'amqplib';
import logger from '../config/logger.config';
import { rabbitmqConfig } from '../config/rabbitMq.config';

export class RabbitMQ {
    private static channel: Channel | null = null;

    static async initialize() {
        let attempt = 0;
        const maxRetries = 5;
        const delayMs = rabbitmqConfig.connection.reconnectDelayMs;

        while (attempt < maxRetries) {
            try {
                attempt++;
                logger.info(`Connecting to RabbitMQ (attempt ${attempt}/${maxRetries})...`);
                const connection = await connect(rabbitmqConfig.connection.url, {
                    heartbeat: rabbitmqConfig.connection.heartbeatSeconds,
                });

                this.channel = await connection.createChannel();

                await this.channel.assertExchange(
                    rabbitmqConfig.exchange.submissions,
                    "direct",
                    { durable: true }
                );

                logger.info("RabbitMQ producer initialized successfully");
                return;
            } catch (err) {
                logger.error(`RabbitMQ connection failed on attempt ${attempt}: ${err}`);
                if (attempt < maxRetries) {
                    logger.warn(`Reconnecting to RabbitMQ in ${delayMs}ms...`);
                    await new Promise(res => setTimeout(res, delayMs));
                } else {
                    logger.error("RabbitMQ connection failed after maximum retries.");
                    throw err;
                }
            }
        }
    }

    static getChannel(): Channel {
        if (!this.channel) {
            throw new Error("RabbitMQ not initialized");
        }
        return this.channel;
    }
}