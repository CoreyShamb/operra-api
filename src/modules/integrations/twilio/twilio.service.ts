import twilio from "twilio";

export type SendTwilioSmsInput = {
  to: string;
  body: string;
  from?: string;
};

export type SendTwilioSmsResult = {
  success: boolean;
  message: string;
  sid?: string;
};

function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid) {
    throw new Error("TWILIO_ACCOUNT_SID is not configured");
  }

  if (!authToken) {
    throw new Error("TWILIO_AUTH_TOKEN is not configured");
  }

  return twilio(accountSid, authToken);
}

function getTwilioFromNumber(customFrom?: string) {
  if (customFrom) {
    return customFrom;
  }

  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!phoneNumber) {
    throw new Error("TWILIO_PHONE_NUMBER is not configured");
  }

  return phoneNumber;
}

export async function sendTwilioSms(
  input: SendTwilioSmsInput
): Promise<SendTwilioSmsResult> {
  const client = getTwilioClient();
  const from = getTwilioFromNumber(input.from);

  const response = await client.messages.create({
    from,
    to: input.to,
    body: input.body,
  });

  return {
    success: true,
    message: "SMS sent successfully",
    sid: response.sid,
  };
}