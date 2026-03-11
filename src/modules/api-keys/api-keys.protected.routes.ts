import { Router, Request, Response } from "express";
import { apiKeyAuthMiddleware } from "../../core/middleware/api-key-auth.middleware";
import { apiRequestLoggingMiddleware } from "../../core/middleware/api-request-logging.middleware";

const router = Router();

router.get(
    "/api-key-test",
    apiKeyAuthMiddleware,
    apiRequestLoggingMiddleware,
    (req: Request, res: Response) => {
        return res.status(200).json({
            success: true,
            message: "API key is valid",
            data: {
                organization: req.organization,
                apiKey: req.apiKey,
            },
        });
    }
);

export default router;