import { RabbitMQ } from "./rabbitMq.connection";
import { rabbitmqConfig } from "../config/rabbitMq.config";
import logger from "../config/logger.config";
import { SubmissionEvaluatedEvent } from "./events";
import { SubmissionService } from "../services/submission.service";
import { SubmissionRepository } from "../repository/submission.repository";
import { mapEvaluatedToDomainStatus } from "../utils/mappers/submissionStatus.mapper";
import { InternalServerError } from "../utils/errors/app.error";
import { notifySubmissionUpdate } from "../webSockets/ws.publisher";


export async function startSubmissionResultConsumer() {
  const channel = RabbitMQ.getChannel();

  await channel.consume( rabbitmqConfig.queues.submissionResult, async (msg) => {
      if (!msg || msg.content == null) 
      {
        logger.warn("[SubmissionService] Received null message, skipping processing");
        throw new InternalServerError("Received null message");
    
      }

      const event: SubmissionEvaluatedEvent = JSON.parse(
        msg.content.toString()
      );

      logger.info("[SubmissionService] SUBMISSION_EVALUATED received", {submissionId: event.submissionId,status: event.submissionStatus,traceId: event.traceId });

      try {
      //Update the submission status in the DB
      const submissionRepository = new SubmissionRepository();
        const submissionService = new SubmissionService(submissionRepository);
        const domainStatus = mapEvaluatedToDomainStatus(event.submissionStatus);

        await submissionService.updateSubmissionStatus(
          event.submissionId,
          domainStatus
        );
        //Notify the frontEnd that the WS is listening
        notifySubmissionUpdate(event.submissionId, { submissionId: event.submissionId, status: "completed",result: "failed"});
        // 2️⃣ ACK only after success
        channel.ack(msg);

        logger.info("[SubmissionService] Submission updated & Acked",{ submissionId: event.submissionId });
      } catch (err) {
        logger.error("[SubmissionService] Failed to process submission result", err);

        //DO NOT ACK
        // RabbitMQ will retry
      }
    },
    { noAck: false }
  );
}
