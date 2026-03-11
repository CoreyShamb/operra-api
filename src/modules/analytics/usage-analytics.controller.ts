import { Request, Response } from "express";
import {
    getUsageAnalytics,
    getDailyUsageAnalytics,
    getEndpointDailyUsageAnalytics,
} from "./usage-analytics.service";

export async function getUsageAnalyticsHandler(req: Request, res: Response) {
    try {
        if (!req.organization) {
            return res.status(401).json({
                success: false,
                message: "Organization context missing",
            });
        }

        const analytics = await getUsageAnalytics(req.organization.id);

        return res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch usage analytics",
        });
    }
}

export async function getDailyUsageAnalyticsHandler(
    req: Request,
    res: Response
) {
    try {
        if (!req.organization) {
            return res.status(401).json({
                success: false,
                message: "Organization context missing",
            });
        }

        const daysParam = req.query.days;
        const days =
            typeof daysParam === "string" ? Math.max(1, Number(daysParam)) : 7;

        const analytics = await getDailyUsageAnalytics(req.organization.id, days);

        return res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch daily usage analytics",
        });
    }
}

export async function getEndpointDailyUsageAnalyticsHandler(
    req: Request,
    res: Response
) {
    try {
        if (!req.organization) {
            return res.status(401).json({
                success: false,
                message: "Organization context missing",
            });
        }

        const daysParam = req.query.days;
        const pathParam = req.query.path;

        const days =
            typeof daysParam === "string" ? Math.max(1, Number(daysParam)) : 7;

        const path = typeof pathParam === "string" ? pathParam : undefined;

        const analytics = await getEndpointDailyUsageAnalytics(
            req.organization.id,
            days,
            path
        );

        return res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch endpoint daily usage analytics",
        });
    }
}