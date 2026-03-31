import {
    SendWebhookInput,
    SendWebhookResult,
} from "./webhook.types";
import { createWebhookSignature } from "./webhook.utils";

export async function sendWebhook(
    input: SendWebhookInput
): Promise<SendWebhookResult> {
    const body = JSON.stringify({
        event: input.event,
        payload: input.payload,
        timestamp: new Date().toISOString(),
    });

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (input.secret) {
        headers["x-webhook-signature"] = createWebhookSignature({
            payload: body,
            secret: input.secret,
        });
    }

    const response = await fetch(input.url, {
        method: "POST",
        headers,
        body,
    });

    if (!response.ok) {
        throw new Error(`Webhook request failed with status ${response.status}`);
    }

    return {
        success: true,
        message: "Webhook sent successfully",
        statusCode: response.status,
    };
}