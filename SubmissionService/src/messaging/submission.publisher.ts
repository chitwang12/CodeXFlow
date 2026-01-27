import { RabbitMQ } from "./rabbitMq.connection";
import { rabbitmqConfig } from "../config/rabbitMq.config";
import { retry } from "../utils/helpers/retry";
import logger from "../config/logger.config";
import { SubmissionCreatedEvent } from "./events";
import { uuid } from "uuidv4";

export async function publishSubmissionCreated(event: SubmissionCreatedEvent): Promise<void> {
    const channel = RabbitMQ.getChannel();

    await retry(
        async () => {
            if(!event.traceId) 
                event.traceId = uuid();
            
            const published = channel.publish(rabbitmqConfig.exchange.submissions, rabbitmqConfig.routingKeys.submissionCreated, Buffer.from(JSON.stringify(event)),
                {
                    persistent: rabbitmqConfig.publish.persistent,
                }
            );

            if (!published) {
                throw new Error("RabbitMQ publish buffer full");
            }
        },
        {
            retries: 3,
            delayMs: 200,
        }
    );

    logger.info(`Submission event published submissionId: ${event.submissionId} with traceId: ${event.traceId}`);
}
