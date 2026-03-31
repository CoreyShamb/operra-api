import { TwilioConfig } from "./twilio.types";

export function getTwilioConfig(): TwilioConfig {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid) {
        throw new Error("TWILIO_ACCOUNT_SID is not configured");
    }

    if (!authToken) {
        throw new Error("TWILIO_AUTH_TOKEN is not configured");
    }

    if (!phoneNumber) {
        throw new Error("TWILIO_PHONE_NUMBER is not configured");
    }

    return {
        accountSid,
        authToken,
        phoneNumber,
    };
}

export function formatPhoneNumber(phone: string): string {
    // Ensure E.164 format (basic normalization)
    if (!phone.startsWith("+")) {
        return `+${phone}`;
    }
    return phone;
}