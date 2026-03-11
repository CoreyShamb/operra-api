import { Router } from "express";
import { apiKeyAuthMiddleware } from "../../core/middleware/api-key-auth.middleware";
import { getUsageAnalyticsHandler } from "./usage-analytics.controller";

const router = Router();

router.get(
    "/analytics/usage",
    apiKeyAuthMiddleware,
    getUsageAnalyticsHandler
);

export default router;