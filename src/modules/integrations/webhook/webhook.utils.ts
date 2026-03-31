import crypto from "crypto";
import { WebhookSignatureInput } from "./webhook.types";

export function createWebhookSignature({
    payload,
    secret,
}: WebhookSignatureInput): string {
    return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}