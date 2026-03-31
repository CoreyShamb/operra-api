import Mailgun from "mailgun.js";
import FormData from "form-data";
import {
    MailgunSendEmailInput,
    MailgunSendEmailResult,
} from "./mailgun.types";
import { getMailgunConfig } from "./mailgun.utils";

export async function sendMailgunEmail(
    input: MailgunSendEmailInput
): Promise<MailgunSendEmailResult> {
    const config = getMailgunConfig();

    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({
        username: "api",
        key: config.apiKey,
    });

    const messageData = {
        from: input.from || config.fromEmail,
        to: [input.to],
        subject: input.subject,
        text: input.text || "",
        ...(input.html ? { html: input.html } : {}),
    };

    const response = await client.messages.create(config.domain, messageData);

    return {
        success: true,
        message: "Email sent successfully",
        id: response.id,
    };
}