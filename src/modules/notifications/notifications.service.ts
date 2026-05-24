import { sendMailgunEmail } from "../integrations/mailgun/mailgun.service";
import { sendTwilioSms } from "../integrations/twilio/twilio.service";
import { sendWebhook } from "../integrations/webhook/webhook.service";
import {
    NotificationResult,
    SendNotificationInput,
} from "./notifications.types";

export async function sendNotification(
    input: SendNotificationInput
): Promise<NotificationResult> {
    switch (input.channel) {
        case "email": {
            await sendMailgunEmail({
                to: input.to,
                subject: input.subject,
                text: input.text,
                html: input.html,
                from: input.from,
            });

            return {
                success: true,
                channel: "email",
                event: input.event,
                message: "Email notification sent successfully",
            };
        }

        case "sms": {
            await sendTwilioSms({
                to: input.to,
                body: input.body,
                from: input.from,
            });

            return {
                success: true,
                channel: "sms",
                event: input.event,
                message: "SMS notification sent successfully",
            };
        }

        case "webhook": {
            await sendWebhook({
                url: input.url,
                event: input.event,
                payload: input.payload,
                secret: input.secret,
            });

            return {
                success: true,
                channel: "webhook",
                event: input.event,
                message: "Webhook notification sent successfully",
            };
        }
    }
}
