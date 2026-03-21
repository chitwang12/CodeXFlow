import express from 'express';
import { serverConfig } from './config';
import v1Router from './routers/v1/index.router';
import v2Router from './routers/v2/index.router';
import { appErrorHandler, genericErrorHandler } from './middlewares/error.middleware';
import logger from './config/logger.config';
import { attachCorrelationIdMiddleware } from './middlewares/correlation.middleware';
import { connectDB } from './config/db.config';
const app = express();
import cors from 'cors';

app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins (you can restrict this in production)
    methods: 'GET,POST,PUT,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization', // Allowed headers
}));
/**
 * Registering all the routers and their corresponding routes with out app server object.
 */

app.use(attachCorrelationIdMiddleware);
app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router); 



/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);


app.listen(serverConfig.PORT, async() => {
    await connectDB();
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info(`Press Ctrl+C to stop the server.`);
    
});
