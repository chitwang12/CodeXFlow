import * as amqp from 'amqplib';
import { Channel } from 'amqplib';
import logger from '../config/logger.config';
import { rabbitmqConfig } from '../config/rabbitMq.config';

export class RabbitMQ {
  private static channel: Channel | null = null;

  static async initialize(): Promise<void> {
    let attempt = 0;

    while (attempt < 5) {
      try {
        attempt++;
        logger.info(`Connecting to RabbitMQ (attempt ${attempt})`);

        // IMPORTANT: do NOT type connection
        const connection = await amqp.connect(
          rabbitmqConfig.connection.url,
          { heartbeat: rabbitmqConfig.connection.heartbeatSeconds }
        );

        const channel = await connection.createChannel();

        await channel.assertExchange(
          rabbitmqConfig.exchange.submissions,
          'direct',
          { durable: true }
        );

        await channel.assertQueue(
          rabbitmqConfig.queues.submissionEvaluate,
          { durable: true }
        );

        await channel.bindQueue(
          rabbitmqConfig.queues.submissionEvaluate,
          rabbitmqConfig.exchange.submissions,
          rabbitmqConfig.routingKeys.submissionCreated
        );

        await channel.prefetch(rabbitmqConfig.consumer.prefetch);

        RabbitMQ.channel = channel;

        logger.info(
          `RabbitMQ connected | exchange=${rabbitmqConfig.exchange.submissions} queue=${rabbitmqConfig.queues.submissionEvaluate}`
        );
        return;
      } catch (err) {
        logger.error('RabbitMQ connection failed', err);
        await new Promise(res => setTimeout(res, 3000));
      }
    }

    throw new Error('RabbitMQ initialization failed');
  }

  static getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ not initialized');
    }
    return this.channel;
  }
}
