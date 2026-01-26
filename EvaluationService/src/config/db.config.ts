import mongoose from "mongoose";
import logger from "./logger.config";
import { serverConfig } from "./index";
import { retry } from "../utils/helpers/retry";

export const connectDB = async () => {
    const dbURL = serverConfig.DB_URL;
    let reconnecting = false;

    const connection = mongoose.connection;

    try {
        if (connection.readyState === 1) {
            logger.info("MongoDB connection already established");
            return connection;
        }

        await retry(
            async () => {
                logger.info("Attempting MongoDB connection...");
                await mongoose.connect(dbURL);
            },
            {
                retries: 5,
                delayMs: 2000,
            }
        );

        logger.info("MongoDB connected successfully");

        // ---- Connection event listeners (NO retries here) ----
        mongoose.connection.on("error", (err) => {
            logger.error("MongoDB connection error", err);
        });

        mongoose.connection.on("disconnected", async () => {
            logger.warn("MongoDB disconnected");
        
            if (reconnecting) {
                logger.warn("Reconnect already in progress, skipping...");
                return;
            }
        
            reconnecting = true;
        
            try {
                await retry(
                    async () => {
                        logger.info("Attempting MongoDB reconnection...");
                        await mongoose.connect(serverConfig.DB_URL);
                    },
                    {
                        retries: 5,
                        delayMs: 3000,
                    }
                );
        
                logger.info("MongoDB reconnected successfully");
            } catch (err) {
                logger.error("MongoDB reconnection failed", err);
            } finally {
                reconnecting = false;
            }
        });

        mongoose.connection.on("reconnected", () => {
            logger.info("MongoDB reconnected");
        });

        process.on("SIGINT", async () => {
            await mongoose.connection.close();
            logger.info(
                "MongoDB connection closed due to application termination"
            );
            process.exit(0);
        });

        return connection;
    } catch (error) {
        logger.error("MongoDB connection failed after retries", error);
        process.exit(1);
    }
};
