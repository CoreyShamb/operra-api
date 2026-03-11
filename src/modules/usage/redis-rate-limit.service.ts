import { redis } from "../../lib/redis";

function getTodayKeyDate() {
    return new Date().toISOString().split("T")[0];
}

export function buildDailyRateLimitKey(organizationId: string) {
    const date = getTodayKeyDate();
    return `rate_limit:org:${organizationId}:${date}`;
}

export async function incrementDailyRequestCount(organizationId: string) {
    const key = buildDailyRateLimitKey(organizationId);

    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, 60 * 60 * 24);
    }

    return count;
}

export async function getDailyRequestCount(organizationId: string) {
    const key = buildDailyRateLimitKey(organizationId);

    const value = await redis.get(key);

    return value ? Number(value) : 0;
}
