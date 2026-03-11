import { NextFunction, Request, Response } from "express";
import { validateApiKey } from "../../modules/api-keys/api-keys.service";

export async function apiKeyAuthMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const apiKeyHeader = req.header("x-api-key");
        const authHeader = req.header("authorization");

        let rawKey: string | undefined;

        if (apiKeyHeader) {
            rawKey = apiKeyHeader;
        } else if (authHeader?.startsWith("Bearer ")) {
            rawKey = authHeader.replace("Bearer ", "").trim();
        }

        if (!rawKey) {
            return res.status(401).json({
                success: false,
                message: "Missing API key",
            });
        }

        const apiKey = await validateApiKey(rawKey);

        if (!apiKey) {
            return res.status(401).json({
                success: false,
                message: "Invalid API key",
            });
        }

        (req as any).organization = apiKey.organization;
        (req as any).apiKey = {
            id: apiKey.id,
            prefix: apiKey.prefix,
            organizationId: apiKey.organizationId,
        };

        return next();
    } catch (error) {
        console.error("[apiKeyAuth] failed:", error);

        return res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "API key auth failed",
        });
    }
}
