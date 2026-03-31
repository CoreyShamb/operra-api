import { Request, Response } from "express";
import { sendWebhook } from "./webhook.service";
import { sendWebhookSchema } from "./webhook.validation";

export async function sendWebhookHandler(req: Request, res: Response) {
    const validatedBody = sendWebhookSchema.parse(req.body);

    const result = await sendWebhook(validatedBody);

    return res.status(200).json(result);
}