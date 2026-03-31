import { z } from "zod";

export const sendWebhookSchema = z.object({
    url: z.string().url("url must be a valid URL"),
    event: z
        .string()
        .min(1, "event is required")
        .max(100, "event must be 100 characters or fewer"),
    payload: z.record(z.string(), z.unknown()),
    secret: z.string().optional(),
});

export type SendWebhookSchemaInput = z.infer<typeof sendWebhookSchema>;