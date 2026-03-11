import { NextFunction, Request, Response } from "express";
import { createApiRequestLog } from "../../modules/api-keys/api-request-log.service";

export function apiRequestLoggingMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.on("finish", async () => {
        try {
            if (!req.organization || !req.apiKey) {
                return;
            }

            await createApiRequestLog({
                organizationId: req.organization.id,
                apiKeyId: req.apiKey.id,
                method: req.method,
                path: req.originalUrl,
                statusCode: res.statusCode,
            });
        } catch (error) {
            console.error("Failed to log API request:", error);
        }
    });

    next();
}