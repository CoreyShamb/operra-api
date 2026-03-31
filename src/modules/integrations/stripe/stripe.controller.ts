import { Request, Response } from "express";
import {
    createCheckoutSession,
    createBillingPortalSession,
} from "./stripe.service";
import {
    createCheckoutSessionSchema,
    createBillingPortalSchema,
} from "./stripe.validation";

export async function createCheckoutSessionHandler(
    req: Request,
    res: Response
) {
    const validatedBody = createCheckoutSessionSchema.parse(req.body);

    const result = await createCheckoutSession(validatedBody);

    return res.status(200).json({
        success: true,
        ...result,
    });
}

export async function createBillingPortalHandler(
    req: Request,
    res: Response
) {
    const validatedBody = createBillingPortalSchema.parse(req.body);

    const result = await createBillingPortalSession(validatedBody);

    return res.status(200).json({
        success: true,
        ...result,
    });
}