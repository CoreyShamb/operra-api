import { prisma } from "../../lib/prisma";

type CreateApiRequestLogParams = {
    organizationId: string;
    apiKeyId?: string;
    method: string;
    path: string;
    statusCode: number;
};

export async function createApiRequestLog(params: CreateApiRequestLogParams) {
    const { organizationId, apiKeyId, method, path, statusCode } = params;

    return prisma.apiRequestLog.create({
        data: {
            organizationId,
            apiKeyId,
            method,
            path,
            statusCode,
        },
    });
}