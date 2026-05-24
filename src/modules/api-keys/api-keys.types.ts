export type ApiKey = {
    id: string;
    organizationId: string;
    name: string;
    prefix: string;
    keyHash: string;
    lastUsedAt: Date | null;
    revokedAt: Date | null;
    expiresAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
};

// Returned in list responses — keyHash is never exposed
export type ApiKeyPublic = Omit<ApiKey, "keyHash">;

// Returned only on creation — includes the raw key shown once
export type ApiKeyCreated = {
    apiKey: Omit<ApiKeyPublic, "updatedAt" | "lastUsedAt">;
    rawKey: string;
};

export type CreateApiKeyInput = {
    organizationId: string;
    name: string;
    expiresAt?: Date;
};

export type GeneratedApiKey = {
    rawKey: string;
    prefix: string;
    keyHash: string;
};

export type ApiRequestLog = {
    id: string;
    organizationId: string;
    apiKeyId: string | null;
    method: string;
    path: string;
    statusCode: number;
    createdAt: Date;
};

export type CreateApiRequestLogInput = {
    organizationId: string;
    apiKeyId?: string;
    method: string;
    path: string;
    statusCode: number;
};
