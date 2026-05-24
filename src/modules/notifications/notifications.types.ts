export type NotificationChannel = "email" | "sms" | "webhook";

export type NotificationEvent =
    | "booking.created"
    | "booking.confirmed"
    | "booking.cancelled"
    | "booking.updated"
    | "booking.reminder";

export type SendEmailNotificationInput = {
    channel: "email";
    event: NotificationEvent;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
};

export type SendSmsNotificationInput = {
    channel: "sms";
    event: NotificationEvent;
    to: string;
    body: string;
    from?: string;
};

export type SendWebhookNotificationInput = {
    channel: "webhook";
    event: NotificationEvent;
    url: string;
    payload: Record<string, unknown>;
    secret?: string;
};

export type SendNotificationInput =
    | SendEmailNotificationInput
    | SendSmsNotificationInput
    | SendWebhookNotificationInput;

export type NotificationResult = {
    success: boolean;
    channel: NotificationChannel;
    event: NotificationEvent;
    message: string;
};
