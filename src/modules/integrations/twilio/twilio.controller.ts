import { Request, Response } from "express";
import { sendTwilioSms } from "./twilio.service";
import { sendSmsSchema } from "./twilio.validation";

export async function sendTwilioSmsHandler(req: Request, res: Response) {
    const validatedBody = sendSmsSchema.parse(req.body);

    const result = await sendTwilioSms(validatedBody);

    return res.status(200).json(result);
}