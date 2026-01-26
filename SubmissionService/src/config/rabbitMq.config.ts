export const rabbitmqConfig = {
    exchange: {
        submissions: "submissions.exchange",
    },

    queues: {
        submissionEvaluate: "submissions.evaluate.queue",
    },

    routingKeys: {
        submissionCreated: "submission.created",
    },

    connection: {
        url: process.env.RABBITMQ_URL || "amqp://localhost:5672",
        heartbeatSeconds: 5,
        reconnectDelayMs: 3000,
    },

    publish: {
        persistent: true,
    },

    consumer: {
        prefetch: 5,
        maxRetries: 3,
    },
};
