import { Request, Response } from "express";
import {
    dailyUsageQuerySchema,
    endpointDailyUsageQuerySchema,
    statusCodeDailyQuerySchema,
} from "./usage-analytics.schemas";
import {
    getDailyUsageAnalytics,
    getEndpointDailyUsageAnalytics,
    getStatusCodeDailyAnalytics,
    getUsageAnalytics,
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

export async function getDailyUsageAnalyticsHandler(req: Request, res: Response) {
    try {
        if (!req.organization) {
            return res.status(401).json({
                success: false,
                message: "Organization context missing",
            });
        }

        const { days } = dailyUsageQuerySchema.parse(req.query);
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

export async function getEndpointDailyUsageAnalyticsHandler(req: Request, res: Response) {
    try {
        if (!req.organization) {
            return res.status(401).json({
                success: false,
                message: "Organization context missing",
            });
        }

        const { days, path } = endpointDailyUsageQuerySchema.parse(req.query);
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

export async function getStatusCodeDailyAnalyticsHandler(req: Request, res: Response) {
    try {
        if (!req.organization) {
            return res.status(401).json({
                success: false,
                message: "Organization context missing",
            });
        }

        const { days, statusCode } = statusCodeDailyQuerySchema.parse(req.query);
        const analytics = await getStatusCodeDailyAnalytics(
            req.organization.id,
            days,
            statusCode
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
                    : "Failed to fetch status code analytics",
        });
    }
}
