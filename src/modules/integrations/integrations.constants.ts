export const INTEGRATION_PROVIDERS = [
    "stripe",
    "twilio",
    "mailgun",
    "webhook",
] as const;

export const INTEGRATION_STATUSES = [
    "connected",
    "disconnected",
    "pending",
    "error",
] as const;