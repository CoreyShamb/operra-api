import { z } from "zod";

const notificationEventSchema = z.enum([
    "booking.created",
    "booking.confirmed",
    "booking.cancelled",
    "booking.updated",
    "booking.reminder",
]);

const sendEmailSchema = z.object({
    channel: z.literal("email"),
    event: notificationEventSchema,
    to: z.email("to must be a valid email address"),
    subject: z.string().min(1, "subject is required").max(255),
    text: z.string().optional(),
    html: z.string().optional(),
    from: z.email("from must be a valid email address").optional(),
});

const sendSmsSchema = z.object({
    channel: z.literal("sms"),
    event: notificationEventSchema,
    to: z.string().min(1, "to is required"),
    body: z.string().min(1, "body is required").max(1600, "body must be 1600 characters or fewer"),
    from: z.string().optional(),
});

const sendWebhookSchema = z.object({
    channel: z.literal("webhook"),
    event: notificationEventSchema,
    url: z.url("url must be a valid URL"),
    payload: z.record(z.string(), z.unknown()),
    secret: z.string().optional(),
});

export const sendNotificationSchema = z.discriminatedUnion("channel", [
    sendEmailSchema,
    sendSmsSchema,
    sendWebhookSchema,
]);

export type SendNotificationSchemaInput = z.infer<typeof sendNotificationSchema>;
