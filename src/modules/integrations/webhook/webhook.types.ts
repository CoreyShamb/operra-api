export type WebhookPayload = Record<string, unknown>;

export type SendWebhookInput = {
    url: string;
    event: string;
    payload: WebhookPayload;
    secret?: string;
};

export type SendWebhookResult = {
    success: boolean;
    message: string;
    statusCode?: number;
};

export type WebhookSignatureInput = {
    payload: string;
    secret: string;
};