import Redis from 'ioredis';
import {serverConfig} from './index';


export const redisClient = new Redis({
    host: serverConfig.REDIS_URL,
    maxRetriesPerRequest: serverConfig.REDIS_RETRIES_PER_REQUEST,
    enableReadyCheck: true,
})

redisClient.on('connect', () => {
    console.log('Connected to Redis server');
})

redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
});

redisClient.on('ready', () => {
    console.log('Redis client is ready to use');
})

redisClient.on('close', () => {
    console.log('Redis connection closed');
});

redisClient.on('reconnecting', () => {
    console.log('Reconnecting to Redis server...');
});

redisClient.on('disconnect', () => {
    console.log('Disconnected from Redis server');
})