import { Request, Response } from "express";
import { sendMailgunEmailSchema } from "./mailgun.validation";
import { sendMailgunEmail } from "./mailgun.service";

export async function sendMailgunEmailHandler(req: Request, res: Response) {
    const validatedBody = sendMailgunEmailSchema.parse(req.body);

    const result = await sendMailgunEmail(validatedBody);

    return res.status(200).json(result);
}