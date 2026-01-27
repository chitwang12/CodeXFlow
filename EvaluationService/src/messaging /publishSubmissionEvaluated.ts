import { RabbitMQ } from "./rabbitMq.connection";
import { rabbitmqConfig } from "../config/rabbitMq.config";
import { SubmissionEvaluatedEvent } from "../interfaces/Submission.Evaluated.Event"
import  logger  from "../config/logger.config";


export async function publishSubmissionEvaluated(event: SubmissionEvaluatedEvent) : Promise<void> {
  const channel = RabbitMQ.getChannel();

  const published = channel.publish(
    rabbitmqConfig.exchange.submissionResult,
    rabbitmqConfig.routingKeys.submissionEvaluated,
    Buffer.from(JSON.stringify(event)),
    { persistent: true }
  );
logger.info(`Published submission evaluated event for submissionId=${event.submissionId} with traceId=${event.traceId}`);

  if (!published) {
    logger.error(`Failed to publish submission evaluated event for submissionId=${event.submissionId} with traceId=${event.traceId}`);
    throw new Error("RabbitMQ publish buffer full");
  }
}
