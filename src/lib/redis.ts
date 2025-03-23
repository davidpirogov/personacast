import Redis from "ioredis";

// Check for proper Node.js environment
const isNodeEnvironment =
    typeof process !== "undefined" && process.versions != null && process.versions.node != null;

// This module should only be imported from server-side code in a Node.js environment
// Otherwise an inscrutable error will be thrown about undefined charCodeAt
if (typeof window !== "undefined" || !isNodeEnvironment) {
    throw new Error("This module can only be used in a Node Runtime environment");
}

let redisClient: Redis | null = null;

export function getRedisClient(): Redis {
    // Double-check we're in the correct environment
    if (!isNodeEnvironment) {
        throw new Error("Attempted to initialize Redis outside of Node Runtime environment");
    }

    if (!redisClient) {
        try {
            redisClient = new Redis({
                host: process.env.REDIS_HOST || "personacast-redis",
                port: Number(process.env.REDIS_PORT) || 6379,
                password: process.env.REDIS_PASSWORD,
                db: Number(process.env.REDIS_DB) || 0,
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => Math.min(times * 50, 2000),
                // Add lazyConnect to prevent immediate connection attempts
                lazyConnect: true,
            });

            // Add error handler
            redisClient.on("error", (error) => {
                console.error("Redis client error:", error);
            });
        } catch (error) {
            console.error("Failed to initialize Redis client in lib/redis.ts", error);
            throw error;
        }
    }

    return redisClient;
}

// Graceful shutdown helper
export async function closeRedis() {
    if (redisClient) {
        try {
            await redisClient.quit();
        } catch (error) {
            console.error("Error closing Redis connection:", error);
        } finally {
            redisClient = null;
        }
    }
}
