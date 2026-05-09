import { prisma } from "../../database/prisma";

type CreateAiRequestLogInput = {
    orgId: string;
    userId?: string | null;
    apiKeyId?: string | null;
    modelId: string;
    endpoint: string;
    promptTokens?: number | null;
    outputTokens?: number | null;
    costCents?: number | null;
    statusCode: number;
};

export async function createAiRequestLog(input: CreateAiRequestLogInput) {
    return prisma.aiRequestLog.create({
        data: {
            orgId: input.orgId,
            userId: input.userId ?? null,
            apiKeyId: input.apiKeyId ?? null,
            modelId: input.modelId,
            endpoint: input.endpoint,
            promptTokens: input.promptTokens ?? null,
            outputTokens: input.outputTokens ?? null,
            costCents: input.costCents ?? null,
            statusCode: input.statusCode,
        },
    });
}