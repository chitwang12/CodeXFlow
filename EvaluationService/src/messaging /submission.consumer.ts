import { ConsumeMessage } from 'amqplib';
import { RabbitMQ } from './rabbitMq.connection';
import logger from '../config/logger.config';
import { rabbitmqConfig } from '../config/rabbitMq.config';
import { EvaluationWorker } from '../workers/evaluation.worker';
import { InternalServerError } from '../utils/errors/app.error';
import { publishSubmissionEvaluated } from './publishSubmissionEvaluated';
import { SubmissionEvaluatedEvent } from "../interfaces/Submission.Evaluated.Event"
import { EvaluationExecutionModel } from '../models/evaluation_executions_model';

export async function startSubmissionConsumer() {
  const channel = RabbitMQ.getChannel();

  await channel.consume(rabbitmqConfig.queues.submissionEvaluate,async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      
      let traceId = "";

      try {
        const payload = JSON.parse(msg.content.toString());
        traceId = payload.traceId || "no-trace-id";

        logger.info("Received submission message", {
          traceId,
          submissionId: payload.submissionId,
        });

        // 🔐 IDEMPOTENCY GATE
        try {
          await EvaluationExecutionModel.create({
            submissionId: payload.submissionId,
            status: "PROCESSING",
            traceId,
            startedAt: new Date(),
          });
        } catch (err: any) {
          if (err.code === 11000) {
            logger.warn("Duplicate submission detected, skipping", {
              traceId,
              submissionId: payload.submissionId,
            });

            channel.ack(msg); // ACK the message to remove it from the queue
            return;
          }
          throw err;
        }

        // Execute exactly once
        const res = await EvaluationWorker.handle(payload, traceId);
        if (!res) {
          throw new InternalServerError("Evaluation failed");
        }

        const evaluationEvent: SubmissionEvaluatedEvent = {
          eventType: "SUBMISSION_EVALUATED",
          submissionId: res.submissionId,
          submissionStatus: res.submissionStatus,
          testcaseResults: res.testcaseResults,
          traceId,
          evaluatedAt: new Date().toISOString(),
        };

        await publishSubmissionEvaluated(evaluationEvent);

        // Mark completed
        try {
          await EvaluationExecutionModel.updateOne(
            { submissionId: payload.submissionId },
            { status: "COMPLETED", completedAt: new Date() }
          );
        } catch (err) {
          logger.warn("Failed to mark execution COMPLETED", {
            err,
            submissionId: payload.submissionId,
          });
        }

        channel.ack(msg);
        logger.info("Message ACKED", {
          traceId,
          submissionId: payload.submissionId,
        });
      } catch (err) {
        logger.error("Evaluation failed", { err, traceId });

        try {
          await EvaluationExecutionModel.updateOne(
            { submissionId: traceId },
            { status: "FAILED", completedAt: new Date() }
          );
        } catch { }

        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}

