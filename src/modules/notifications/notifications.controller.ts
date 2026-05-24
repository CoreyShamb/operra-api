import { Response } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import { sendNotificationSchema } from "./notifications.schemas";
import { sendNotification } from "./notifications.service";

export async function sendNotificationHandler(req: AuthRequest, res: Response) {
    const validatedBody = sendNotificationSchema.parse(req.body);
    const result = await sendNotification(validatedBody);

    return res.status(200).json({
        success: true,
        data: result,
    });
}
