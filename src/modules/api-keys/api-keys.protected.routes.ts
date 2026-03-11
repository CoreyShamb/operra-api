import { Router, Request, Response } from "express";
import { apiKeyAuthMiddleware } from "../../core/middleware/api-key-auth.middleware";
import { redisRateLimitMiddleware } from "../../core/middleware/redis-rate-limit.middleware";
import { usageLimitMiddleware } from "../../core/middleware/usage-limit.middleware";
import { apiRequestLoggingMiddleware } from "../../core/middleware/api-request-logging.middleware";

const router = Router();

router.get(
  "/api-key-test",
  apiKeyAuthMiddleware,
  redisRateLimitMiddleware,
  usageLimitMiddleware,
  apiRequestLoggingMiddleware,
  (req: Request, res: Response) => {
    console.log("Reached final handler");

    return res.status(200).json({
      success: true,
      message: "API key is valid",
      data: {
        organization: (req as any).organization,
        apiKey: (req as any).apiKey,
      },
    });
  }
);

export default router;