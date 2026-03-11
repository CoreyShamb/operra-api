// src/utils/api-key.ts
import crypto from "crypto";

export function generateApiKey() {
    const prefix = `op_live_${crypto.randomBytes(4).toString("hex")}`;
    const secret = crypto.randomBytes(24).toString("hex");
    const rawKey = `${prefix}.${secret}`;

    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    return {
        rawKey,
        prefix,
        keyHash,
    };
}

export function hashApiKey(rawKey: string) {
    return crypto.createHash("sha256").update(rawKey).digest("hex");
}