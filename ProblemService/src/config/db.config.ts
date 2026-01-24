import mongoose   from 'mongoose';
import logger from './logger.config';
import { serverConfig } from './index';

export const connectDB = async () => {
    try {
        const dbURL = serverConfig.DB_URL;
        //Use a singeton pattern to connect to the database
        const connection = mongoose.connection;
        if (connection.readyState === 0) {
            await mongoose.connect(dbURL);
            logger.info('MongoDB connected successfully');
        } else {
            logger.info('MongoDB connection already established');
        }
        
        //events for mongoose connection
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            logger.info('MongoDB connection closed due to application termination');
            process.exit(0);
        });

        return connection;
    } catch (error) {
        logger.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}