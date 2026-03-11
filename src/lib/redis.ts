import "dotenv/config";
import Redis from "ioredis";

if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL is not set");
}

export const redis = new Redis(process.env.REDIS_URL, {
    connectTimeout: 1000,
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    retryStrategy: (times) => {
        if (times > 3) {
            return null;
        }

        return Math.min(times * 200, 1000);
    },
});

export function isRedisReady() {
    return redis.status === "ready";
}

redis.on("connect", () => {
    console.log("Redis connected");
});

redis.on("error", (error) => {
    console.error("Redis error:", error);
});
