import { Router, Request, Response } from "express";
import { apiKeyAuthMiddleware } from "../../core/middleware/api-key-auth.middleware";

const router = Router();

router.get("/api-key-test", apiKeyAuthMiddleware, (req: Request, res: Response) => {
    return res.status(200).json({
        success: true,
        message: "API key is valid",
        data: {
            organization: (req as any).organization,
            apiKey: (req as any).apiKey,
        },
    });
});

export default router;