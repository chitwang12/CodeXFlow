import { ConsumeMessage } from 'amqplib';
import { RabbitMQ } from './rabbitMq.connection';
import logger from '../config/logger.config';
import { rabbitmqConfig } from '../config/rabbitMq.config';
import { EvaluationWorker } from '../workers/evaluation.worker';

export async function startSubmissionConsumer() {
  const channel = RabbitMQ.getChannel();

  await channel.consume(rabbitmqConfig.queues.submissionEvaluate, async (msg: ConsumeMessage | null) => {
      
    if (!msg) {
        logger.info('Received null message, skipping processing');
        return;
    }
    let traceId : string = '';
      try {
        const payload = JSON.parse(msg.content.toString());

        traceId = payload.traceId || 'no-trace-id';
        logger.info('Received submission message', { traceId, submissionId: payload.submissionId });

        await EvaluationWorker.handle(payload, traceId);

        channel.ack(msg);
        logger.info(`Message ACKED | traceId: ${traceId} and submissionId=${payload.submissionId}`);
      } catch (err) {

        logger.error('Evaluation failed for traceId ', { err, traceId});

        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );

  logger.info(
    `Evaluation consumer attached to queue: ${rabbitmqConfig.queues.submissionEvaluate}`
  );
}
