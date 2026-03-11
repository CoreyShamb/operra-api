import { Router } from "express";
import { apiKeyAuthMiddleware } from "../../core/middleware/api-key-auth.middleware";
import {
    getUsageAnalyticsHandler,
    getDailyUsageAnalyticsHandler,
    getEndpointDailyUsageAnalyticsHandler,
    getStatusCodeDailyAnalyticsHandler,
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

router.get(
    "/status-codes/daily",
    apiKeyAuthMiddleware,
    getStatusCodeDailyAnalyticsHandler
);

export default router;