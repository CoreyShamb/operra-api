import { z } from "zod";

export const sendSmsSchema = z.object({
    to: z
        .string()
        .min(10, "Phone number is too short")
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164 required)"),
    body: z
        .string()
        .min(1, "Message body is required")
        .max(1600, "Message is too long"),
    from: z.string().optional(),
});

export type SendSmsInput = z.infer<typeof sendSmsSchema>;