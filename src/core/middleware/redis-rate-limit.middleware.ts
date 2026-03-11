import { NextFunction, Request, Response } from "express";
import { DAILY_REQUEST_LIMITS } from "../../config/rate-limits";
import { incrementDailyRequestCount } from "../../modules/usage/redis-rate-limit.service";
import { isRedisReady } from "../../lib/redis";

export async function redisRateLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.organization) {
            return next();
        }

        const organizationId = req.organization.id;

        const plan = "starter";
        const limit =
            DAILY_REQUEST_LIMITS[plan as keyof typeof DAILY_REQUEST_LIMITS] ?? 1000;

        if (!isRedisReady()) {
            console.error("[redisRateLimit] redis is not ready");
            return res.status(503).json({
                success: false,
                message: "Rate limit service unavailable",
            });
        }

        const count = await incrementDailyRequestCount(organizationId);

        res.setHeader("X-RateLimit-Limit", String(limit));
        res.setHeader("X-RateLimit-Remaining", String(Math.max(0, limit - count)));

        if (count > limit) {
            return res.status(429).json({
                success: false,
                message: "Daily API request limit exceeded",
                plan,
                limit,
                currentCount: count,
            });
        }

        return next();
    } catch (error) {
        console.error("[redisRateLimit] failed:", error);
        return res.status(503).json({
            success: false,
            message: "Rate limit service unavailable",
        });
    }
}
