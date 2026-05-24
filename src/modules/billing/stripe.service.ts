import Stripe from "stripe";
import {
    CreateBillingPortalSessionParams,
    CreateStripeCheckoutSessionParams,
} from "./billing.types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function createStripeCheckoutSession(
    params: CreateStripeCheckoutSessionParams
) {
    const { organizationId, organizationName, stripeCustomerId, priceId } = params;

    const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        ...(stripeCustomerId ? { customer: stripeCustomerId } : {}),
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${process.env.FRONTEND_URL}/billing?success=true`,
        cancel_url: `${process.env.FRONTEND_URL}/billing?canceled=true`,
        metadata: {
            organizationId,
            organizationName,
        },
        subscription_data: {
            metadata: {
                organizationId,
            },
        },
    });

    return session;
}

export async function createStripeBillingPortalSession(
    params: CreateBillingPortalSessionParams
) {
    const session = await stripe.billingPortal.sessions.create({
        customer: params.customerId,
        return_url: `${process.env.FRONTEND_URL}/billing`,
    });

    return session;
}

export function getStripeClient() {
    return stripe;
}