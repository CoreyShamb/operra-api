import { NextFunction, Request, Response } from "express";
import { PLAN_LIMITS } from "../../config/plan-limits";
import {
    getTodayRequestCount,
    getOrganizationPlan,
} from "../../modules/usage/usage.service";

export async function usageLimitMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.organization) {
            return next();
        }

        const organizationId = req.organization.id;

        const plan = await getOrganizationPlan(organizationId);
        const requestCount = await getTodayRequestCount(organizationId);

        const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];

        if (requestCount >= limit) {
            return res.status(429).json({
                success: false,
                message: "Daily API request limit exceeded",
                plan,
                limit,
            });
        }

        next();
    } catch (error) {
        console.error("Usage limit check failed:", error);
        next();
    }
}