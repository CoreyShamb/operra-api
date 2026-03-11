import { Router } from "express";
import { apiKeyAuthMiddleware } from "../../core/middleware/api-key-auth.middleware";
import {
    getUsageAnalyticsHandler,
    getDailyUsageAnalyticsHandler,
    getEndpointDailyUsageAnalyticsHandler,
} from "./usage-analytics.controller";

const router = Router();

router.get("/usage", apiKeyAuthMiddleware, getUsageAnalyticsHandler);

router.get(
    "/usage/daily",
    apiKeyAuthMiddleware,
    getDailyUsageAnalyticsHandler
);

router.get(
    "/usage/daily/endpoint",
    apiKeyAuthMiddleware,
    getEndpointDailyUsageAnalyticsHandler
);

router.get(
    "/usage/endpoints/daily",
    apiKeyAuthMiddleware,
    getEndpointDailyUsageAnalyticsHandler
);

export default router;