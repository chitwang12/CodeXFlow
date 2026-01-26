import { connect, Channel } from "amqplib";
import logger from "../config/logger.config";
import { retry } from "../utils/helpers/retry";
import { rabbitmqConfig } from "../config/rabbitMq.config";

export class RabbitMQ {
    private static channel: Channel;

    static async init(): Promise<void> {
        if (this.channel) return;

        await retry(
            async () => {
                logger.info("Connecting to RabbitMQ...");
                const connection = await connect(
                    rabbitmqConfig.connection.url,
                    {
                        heartbeat: rabbitmqConfig.connection.heartbeatSeconds,
                    }
                );

                this.channel = await connection.createChannel();

                await this.channel.assertExchange(
                    rabbitmqConfig.exchange.submissions,
                    "direct",
                    { durable: true }
                );

                await this.channel.assertQueue(
                    rabbitmqConfig.queues.submissionEvaluate,
                    { durable: true }
                );

                await this.channel.bindQueue(
                    rabbitmqConfig.queues.submissionEvaluate,
                    rabbitmqConfig.exchange.submissions,
                    rabbitmqConfig.routingKeys.submissionCreated
                );

                logger.info("RabbitMQ connected and topology asserted");
            },
            {
                retries: 5,
                delayMs: rabbitmqConfig.connection.reconnectDelayMs,
            }
        );
    }

    static getChannel(): Channel {
        if (!this.channel) {
            throw new Error("RabbitMQ not initialized");
        }
        return this.channel;
    }
}
