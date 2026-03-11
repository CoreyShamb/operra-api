import { Request, Response } from "express";
import { getUsageAnalytics } from "./usage-analytics.service";

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