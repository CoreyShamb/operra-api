import { Router } from "express";
import { callClaude } from "../../lib/bedrock";
import { createAiRequestLog } from "./ai-request-log.service";

// 🔐 Existing middlewares
import { apiKeyAuthMiddleware } from "../../core/middleware/api-key-auth.middleware";
import { redisRateLimitMiddleware } from "../../core/middleware/redis-rate-limit.middleware";
import { usageLimitMiddleware } from "../../core/middleware/usage-limit.middleware";
import { apiRequestLoggingMiddleware } from "../../core/middleware/api-request-logging.middleware";

const router = Router();

const MODEL_ID =
    process.env.AWS_BEDROCK_MODEL_ID ||
    "anthropic.claude-3-haiku-20240307-v1:0";

router.post(
    "/chat",

    // 🔥 ORDER MATTERS
    apiKeyAuthMiddleware,
    redisRateLimitMiddleware,
    usageLimitMiddleware,
    apiRequestLoggingMiddleware,

    async (req, res) => {
        const endpoint = "/api/v1/ai/chat";
        const requestContext = req as any;

        try {
            const { message } = req.body;

            if (!message || typeof message !== "string") {
                return res.status(400).json({
                    success: false,
                    error: "Message is required",
                });
            }

            const response = await callClaude(message);

            // Temporary token approximation until we parse real Bedrock token usage
            const promptTokens = message.length;
            const outputTokens =
                typeof response === "string"
                    ? response.length
                    : JSON.stringify(response).length;

            await createAiRequestLog({
                orgId:
                    requestContext.organizationId ||
                    requestContext.orgId ||
                    requestContext.apiKey?.organizationId,
                userId: requestContext.userId || null,
                apiKeyId: requestContext.apiKeyId || requestContext.apiKey?.id || null,
                modelId: MODEL_ID,
                endpoint,
                promptTokens,
                outputTokens,
                costCents: null,
                statusCode: 200,
            });

            return res.status(200).json({
                success: true,
                data: response,
            });
        } catch (error) {
            console.error("AI chat error:", error);

            const orgId =
                requestContext.organizationId ||
                requestContext.orgId ||
                requestContext.apiKey?.organizationId;

            if (orgId) {
                await createAiRequestLog({
                    orgId,
                    userId: requestContext.userId || null,
                    apiKeyId: requestContext.apiKeyId || requestContext.apiKey?.id || null,
                    modelId: MODEL_ID,
                    endpoint,
                    promptTokens: null,
                    outputTokens: null,
                    costCents: null,
                    statusCode: 500,
                });
            }

            return res.status(500).json({
                success: false,
                error: "AI request failed",
            });
        }
    }
);

export default router;