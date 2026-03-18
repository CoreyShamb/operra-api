import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { getStripeClient } from "./stripe.service";

const stripe = getStripeClient();

function getWebhookSecret(): string {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!secret) {
        throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }

    return secret;
}

function getPlanKeyFromPriceId(
    priceId?: string | null
): "free" | "starter" | "growth" | "business" | "professional" {
    if (!priceId) return "free";

    if (priceId === process.env.STRIPE_PRICE_STARTER) return "starter";
    if (priceId === process.env.STRIPE_PRICE_GROWTH) return "growth";
    if (priceId === process.env.STRIPE_PRICE_BUSINESS) return "business";
    if (priceId === process.env.STRIPE_PRICE_PROFESSIONAL) return "professional";

    return "free";
}

async function handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
) {
    const organizationId = session.metadata?.organizationId;
    const customerId =
        typeof session.customer === "string" ? session.customer : null;
    const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

    if (!organizationId) {
        throw new Error(
            "Missing organizationId in checkout.session.completed metadata"
        );
    }

    let plan: "free" | "starter" | "growth" | "business" | "professional" =
        "free";
    let subscriptionStatus = "inactive";

    if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0]?.price?.id ?? null;

        plan = getPlanKeyFromPriceId(priceId);
        subscriptionStatus = subscription.status;
    }

    await prisma.organization.update({
        where: { id: organizationId },
        data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus,
            plan,
        },
    });
}

async function handleCustomerSubscriptionUpdated(
    subscription: Stripe.Subscription
) {
    const organizationId = subscription.metadata?.organizationId;
    const customerId =
        typeof subscription.customer === "string" ? subscription.customer : null;
    const subscriptionId = subscription.id;
    const priceId = subscription.items.data[0]?.price?.id ?? null;

    const plan = getPlanKeyFromPriceId(priceId);
    const subscriptionStatus = subscription.status;

    if (organizationId) {
        await prisma.organization.update({
            where: { id: organizationId },
            data: {
                stripeCustomerId: customerId,
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus,
                plan,
            },
        });

        return;
    }

    if (customerId) {
        await prisma.organization.updateMany({
            where: { stripeCustomerId: customerId },
            data: {
                stripeSubscriptionId: subscriptionId,
                subscriptionStatus,
                plan,
            },
        });
    }
}

async function handleCustomerSubscriptionDeleted(
    subscription: Stripe.Subscription
) {
    const organizationId = subscription.metadata?.organizationId;
    const customerId =
        typeof subscription.customer === "string" ? subscription.customer : null;

    const data = {
        subscriptionStatus: "canceled",
        stripeSubscriptionId: null,
        plan: "free" as const,
    };

    if (organizationId) {
        await prisma.organization.update({
            where: { id: organizationId },
            data,
        });

        return;
    }

    if (customerId) {
        await prisma.organization.updateMany({
            where: { stripeCustomerId: customerId },
            data,
        });
    }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;

    if (!customerId) {
        return;
    }

    await prisma.organization.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
            subscriptionStatus: "past_due",
        },
    });
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
    const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;

    if (!customerId) {
        return;
    }

    await prisma.organization.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
            subscriptionStatus: "active",
        },
    });
}

export async function stripeWebhook(req: Request, res: Response) {
    try {
        const signature = req.headers["stripe-signature"];

        if (!signature || typeof signature !== "string") {
            return res.status(400).json({
                success: false,
                message: "Missing Stripe signature",
            });
        }

        const rawBody = req.body;

        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            getWebhookSecret()
        );

        switch (event.type) {
            case "checkout.session.completed": {
                await handleCheckoutSessionCompleted(
                    event.data.object as Stripe.Checkout.Session
                );
                break;
            }

            case "customer.subscription.created":
            case "customer.subscription.updated": {
                await handleCustomerSubscriptionUpdated(
                    event.data.object as Stripe.Subscription
                );
                break;
            }

            case "customer.subscription.deleted": {
                await handleCustomerSubscriptionDeleted(
                    event.data.object as Stripe.Subscription
                );
                break;
            }

            case "invoice.paid": {
                await handleInvoicePaid(event.data.object as Stripe.Invoice);
                break;
            }

            case "invoice.payment_failed": {
                await handleInvoicePaymentFailed(
                    event.data.object as Stripe.Invoice
                );
                break;
            }

            default: {
                console.log(`[stripeWebhook] unhandled event type: ${event.type}`);
            }
        }

        return res.status(200).json({ received: true });
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Webhook handling failed";

        console.error("[stripeWebhook] error:", error);

        return res.status(400).json({
            success: false,
            message,
        });
    }
}