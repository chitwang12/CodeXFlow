export const rabbitmqConfig = {
    exchange: {
      submissions: "submissions.exchange",
      submissionResult: "submissions.result.exchange",
    },
  
    queues: {
      submissionEvaluate: "submissions.evaluate.queue",
      submissionResult: "submissions.result.queue",
    },
  
    routingKeys: {
      submissionCreated: "submission.created",
      submissionEvaluated: "submission.evaluated",
    },
  
    connection: {
      url: process.env.RABBITMQ_URL || "amqp://localhost:5672",
      heartbeatSeconds: 5,
    },
  
    consumer: {
      prefetch: 5,
    },
  };
  