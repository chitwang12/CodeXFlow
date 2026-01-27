export const rabbitmqConfig = {
    exchange: {
        submissions: "submissions.exchange",
        submission_result: "submission.result.exchange",

    },

    queues: {
        submissionEvaluate: "submissions.evaluate.queue",
        submission_result_queue: "submissions.result.queue",
    },

    routingKeys: {
        submissionCreated: "submission.created",
        submissionResult: "submission.result",
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
