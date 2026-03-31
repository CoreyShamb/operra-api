import { MailgunConfig } from "./mailgun.types";

export function getMailgunConfig(): MailgunConfig {
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;
    const fromEmail = process.env.MAILGUN_FROM_EMAIL;

    if (!apiKey) {
        throw new Error("MAILGUN_API_KEY is not configured");
    }

    if (!domain) {
        throw new Error("MAILGUN_DOMAIN is not configured");
    }

    if (!fromEmail) {
        throw new Error("MAILGUN_FROM_EMAIL is not configured");
    }

    return {
        apiKey,
        domain,
        fromEmail,
    };
}