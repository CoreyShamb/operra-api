import { Request, Response } from "express";
import {
    getOrganizationSubscription,
    createCheckoutSession as createCheckoutSessionService,
    createBillingPortalSession as createBillingPortalSessionService,
} from "./billing.service";
import { PlanKey } from "./billing.types";

export const getSubscription = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.params as { organizationId: string };

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required",
            });
        }

        const subscription = await getOrganizationSubscription(organizationId);

        return res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Failed to fetch subscription";

        const statusCode = message === "Organization not found" ? 404 : 500;

        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
};

export const createCheckoutSession = async (
    req: Request,
    res: Response
) => {
    try {
        const { organizationId } = req.params as { organizationId: string };
        const { planKey } = req.body as { planKey?: PlanKey };

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required",
            });
        }

        if (!planKey) {
            return res.status(400).json({
                success: false,
                message: "Plan key is required",
            });
        }

        const session = await createCheckoutSessionService({
            organizationId,
            planKey,
        });

        return res.status(200).json({
            success: true,
            message: "Checkout session created successfully",
            data: {
                id: session.id,
                url: session.url,
            },
        });
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Failed to create checkout session";

        const statusCode =
            message === "Organization not found" ||
                message === "Invalid plan selected" ||
                message === "Free plan does not require checkout"
                ? 400
                : 500;

        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
};

export const createBillingPortalSession = async (
    req: Request,
    res: Response
) => {
    try {
        const { organizationId } = req.params as { organizationId: string };

        if (!organizationId) {
            return res.status(400).json({
                success: false,
                message: "Organization ID is required",
            });
        }

        const session = await createBillingPortalSessionService(organizationId);

        return res.status(200).json({
            success: true,
            message: "Billing portal session created successfully",
            data: {
                url: session.url,
            },
        });
    } catch (error) {
        const message =
            error instanceof Error         ? error.message         : "Failed to create billing portal session";

        const statusCode =
            message === "Organization not found"
                ? 404
                : message === "Organization does not have a Stripe customer ID"
                    ? 400
                    : 500;

        return res.status(statusCode).json({
            success: false,
            message,
        });
    }
};
