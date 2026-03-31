import { getStripeClient } from "./stripe.utils";
import {
    CreateCheckoutSessionInput,
    CreateCheckoutSessionResult,
    CreateBillingPortalSessionInput,
    CreateBillingPortalSessionResult,
} from "./stripe.types";

export async function createCheckoutSession(
    input: CreateCheckoutSessionInput
): Promise<CreateCheckoutSessionResult> {
    const stripe = getStripeClient();

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
            {
                price: input.priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.FRONTEND_URL}/success`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
            organizationId: input.organizationId,
        },
        customer: input.customerId,
    });

    if (!session.url) {
        throw new Error("Failed to create checkout session");
    }

    return {
        url: session.url,
    };
}

export async function createBillingPortalSession(
    input: CreateBillingPortalSessionInput
): Promise<CreateBillingPortalSessionResult> {
    const stripe = getStripeClient();

    const session = await stripe.billingPortal.sessions.create({
        customer: input.customerId,
        return_url: process.env.FRONTEND_URL,
    });

    return {
        url: session.url,
    };
}