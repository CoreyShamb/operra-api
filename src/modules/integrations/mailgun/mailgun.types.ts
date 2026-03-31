export type MailgunSendEmailInput = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
    from?: string;
};

export type MailgunSendEmailResult = {
    success: boolean;
    message: string;
    id?: string;
};

export type MailgunConfig = {
    apiKey: string;
    domain: string;
    fromEmail: string;
};