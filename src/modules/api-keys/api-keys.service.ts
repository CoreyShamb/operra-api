import { prisma } from "../../lib/prisma";
import { generateApiKey, hashApiKey } from "../../core/utils/api-key";

type CreateApiKeyParams = {
    organizationId: string;
    name: string;
    expiresAt?: Date;
};

export async function createApiKey(params: CreateApiKeyParams) {
    const { organizationId, name, expiresAt } = params;

    const { rawKey, prefix, keyHash } = generateApiKey();

    const apiKey = await prisma.apiKey.create({
        data: {
            organizationId,
            name,
            prefix,
            keyHash,
            expiresAt,
        },
        select: {
            id: true,
            organizationId: true,
            name: true,
            prefix: true,
            createdAt: true,
            expiresAt: true,
            revokedAt: true,
        },
    });

    return {
        apiKey,
        rawKey,
    };
}

export async function listApiKeys(organizationId: string) {
    return prisma.apiKey.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            prefix: true,
            createdAt: true,
            updatedAt: true,
            expiresAt: true,
            revokedAt: true,
            lastUsedAt: true,
        },
    });
}

export async function revokeApiKey(id: string) {
    return prisma.apiKey.update({
        where: { id },
        data: { revokedAt: new Date() },
        select: {
            id: true,
            name: true,
            revokedAt: true,
        },
    });
}

export async function validateApiKey(rawKey: string) {
    const keyHash = hashApiKey(rawKey);

    const apiKey = await prisma.apiKey.findUnique({
        where: { keyHash },
        include: {
            organization: true,
        },
    });

    if (!apiKey) {
        return null;
    }

    if (apiKey.revokedAt) {
        return null;
    }

    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) {
        return null;
    }

    try {
        await prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        });
    } catch (error) {
        console.error("[validateApiKey] failed to update lastUsedAt", error);
    }

    return apiKey;
}
