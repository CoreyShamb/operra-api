export type TwilioPhoneNumber = string;

export type SendTwilioSmsInput = {
    to: TwilioPhoneNumber;
    body: string;
    from?: TwilioPhoneNumber;
};

export type SendTwilioSmsResult = {
    success: boolean;
    message: string;
    sid?: string;
};

export type TwilioConfig = {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
};