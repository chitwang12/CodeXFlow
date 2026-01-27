import http from 'http';
import app from './app';
import { serverConfig } from './config';
import logger from './config/logger.config';
import { connectDB } from './config/db.config';
import { RabbitMQ } from './messaging/rabbitMq.connection';
import { initProblemService } from './api/problem.client';
import { startSubmissionResultConsumer } from './messaging/submissionResult.consumer';
import { initWebSocket } from './webSockets/ws.server';

const server = http.createServer(app);

initWebSocket(server); // ✅ WebSocket attaches HERE

server.listen(serverConfig.PORT, async () => {
  await connectDB();
  await RabbitMQ.initialize();
  await RabbitMQ.getChannel();
  await initProblemService();
  await startSubmissionResultConsumer();

  logger.info(`Server running at http://localhost:${serverConfig.PORT}`);
});
