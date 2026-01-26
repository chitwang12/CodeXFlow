export async function retry<T>( fn: () => Promise<T>, options: {
    retries: number;
    delayMs: number;
    shouldRetry?: (error: any) => boolean;
}): Promise<T> 
{
let attempt = 0;

while (true) {
    try {
        return await fn();
    } catch (err) {
        attempt++;

        if (
            attempt > options.retries ||
            (options.shouldRetry && !options.shouldRetry(err))
        ) {
            throw err;
        }

        const jitter = Math.floor(Math.random() * 100);
        const delay = options.delayMs * attempt + jitter;

        await new Promise((res) => setTimeout(res, delay));
    }
}
}
