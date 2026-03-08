import crypto from "crypto";
import prisma from "../../lib/prisma";

export class ApiKeysService {
    async createApiKey(organizationId: string, name: string) {
        const rawKey = `op_live_${crypto.randomBytes(24).toString("hex")}`;
        const keyPrefix = rawKey.slice(0, 12);
        const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

        const apiKey = await prisma.apiKey.create({
            data: {
                organizationId,
                name,
                keyPrefix,
                keyHash,
            },
            select: {
                id: true,
                name: true,
                keyPrefix: true,
                createdAt: true,
            },
        });

        return {
            apiKey,
            rawKey,
        };
    }

    async getOrganizationApiKeys(organizationId: string) {
        return prisma.apiKey.findMany({
            where: {
                organizationId,
                revokedAt: null,
            },
            select: {
                id: true,
                name: true,
                keyPrefix: true,
                lastUsedAt: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async revokeApiKey(apiKeyId: string, organizationId: string) {
        return prisma.apiKey.update({
            where: {
                id: apiKeyId,
            },
            data: {
                revokedAt: new Date(),
            },
        });
    }
}