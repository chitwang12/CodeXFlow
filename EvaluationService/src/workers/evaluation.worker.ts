import logger from '../config/logger.config';

export class EvaluationWorker {
  static async handle(data: any, traceId?: string) {
    logger.info('Evaluation worker started', { traceId, submissionId: data.submissionId });

    // TEMP PLACEHOLDER — mimic BullMQ job processing
    await new Promise(res => setTimeout(res, 1000));

    logger.info('Evaluation worker completed', { traceId, submissionId: data.submissionId });
  }
}
