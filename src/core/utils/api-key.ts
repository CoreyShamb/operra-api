import crypto from "crypto";

const API_KEY_PREFIX = "op_live_";

export function generateApiKey(): string {
    const random = crypto.randomBytes(24).toString("hex");
    return `${API_KEY_PREFIX}${random}`;
}

export function hashApiKey(rawKey: string): string {
    return crypto.createHash("sha256").update(rawKey).digest("hex");
}

export function getApiKeyPrefix(rawKey: string): string {
    return rawKey.slice(0, 16);
}

export function looksLikeOperraApiKey(token: string): boolean {
    return token.startsWith("op_live_");
}