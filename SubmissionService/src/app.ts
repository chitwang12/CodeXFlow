import express from 'express';
import cors from 'cors';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { attachUserContext } from './middlewares/context.middleware';

const app = express();

app.use(express.json());
app.use(cors());

app.use(attachUserContext);
app.use(attachCorrelationIdMiddleware);

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);

app.use(appErrorHandler);
app.use(genericErrorHandler);

export default app;
