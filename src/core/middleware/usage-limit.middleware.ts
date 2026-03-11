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
    console.log("[usageLimit] start");

    try {
        const organization = (req as any).organization;

        if (!organization) {
            console.log("[usageLimit] skipped: no organization on request");
            return next();
        }

        const organizationId = organization.id;

        console.log("[usageLimit] organizationId:", organizationId);

        /*
         Get organization plan
        */
        const plan = await getOrganizationPlan(organizationId);

        console.log("[usageLimit] plan:", plan);

        /*
         Resolve plan limit
        */
        const limit = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS];

        if (!limit) {
            console.error("[usageLimit] invalid plan:", plan);
            return res.status(500).json({
                success: false,
                message: "Invalid organization plan configuration",
            });
        }

        console.log("[usageLimit] limit:", limit);

        /*
         Get today's request count
        */
        const requestCount = await getTodayRequestCount(organizationId);

        console.log("[usageLimit] requestCount:", requestCount);

        /*
         Enforce limit
        */
        if (requestCount >= limit) {
            console.warn("[usageLimit] limit exceeded");

            return res.status(429).json({
                success: false,
                message: "Daily API request limit exceeded",
                plan,
                limit,
                currentCount: requestCount,
            });
        }

        console.log("[usageLimit] allowed");

        return next();
    } catch (error) {
        console.error("[usageLimit] middleware error:", error);

        return next(error);
    }
}