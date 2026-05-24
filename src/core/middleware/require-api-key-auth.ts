import { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma";
import { hashApiKey, looksLikeOperraApiKey } from "../utils/api-key";

export async function requireApiKeyAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Missing or invalid Authorization header",
            });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        if (!looksLikeOperraApiKey(token)) {
            return res.status(401).json({
                message: "Invalid API key format",
            });
        }

        const keyHash = hashApiKey(token);

        const apiKey = await prisma.apiKey.findUnique({
            where: { keyHash },
            include: {
                organization: true,
            },
        });

        if (!apiKey) {
            return res.status(401).json({
                message: "Invalid API key",
            });
        }

        if (apiKey.revokedAt) {
            return res.status(401).json({
                message: "API key has been revoked",
            });
        }

        if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
            return res.status(401).json({
                message: "API key has expired",
            });
        }

        req.apiKeyAuth = {
            apiKeyId: apiKey.id,
            organizationId: apiKey.organizationId,
            keyPrefix: apiKey.prefix,
        };

        await prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        });

        next();
    } catch (error) {
        next(error);
    }
}