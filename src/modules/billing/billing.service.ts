import { prisma } from "../../lib/prisma";
import {
    createStripeBillingPortalSession,
    createStripeCheckoutSession,
} from "./stripe.service";
import { getPlanByKey } from "./plan.config";
import { PlanKey } from "./plan.config";

export async function getOrganizationSubscription(organizationId: string) {
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: {
            id: true,
            name: true,
            subscription: true,
            stripeCustomerId: true,
        },
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    return organization;
}

type CreateCheckoutSessionParams = {
    organizationId: string;
    planKey: PlanKey;
};

export async function createCheckoutSession(
    params: CreateCheckoutSessionParams
) {
    const { organizationId, planKey } = params;

    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: {
            id: true,
            name: true,
            stripeCustomerId: true,
        },
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    const plan = getPlanByKey(planKey);

    if (!plan) {
        throw new Error("Invalid plan selected");
    }

    if (plan.isFree) {
        throw new Error("Free plan does not require checkout");
    }

    if (!plan.stripePriceId) {
        throw new Error(`Stripe price ID is missing for plan: ${plan.key}`);
    }

    const session = await createStripeCheckoutSession({
        organizationId: organization.id,
        organizationName: organization.name,
        stripeCustomerId: organization.stripeCustomerId ?? undefined,
        priceId: plan.stripePriceId,
    });

    return session;
}

export async function createBillingPortalSession(organizationId: string) {
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: {
            id: true,
            stripeCustomerId: true,
        },
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    if (!organization.stripeCustomerId) {
        throw new Error("Organization does not have a Stripe customer ID");
    }

    const session = await createStripeBillingPortalSession({
        customerId: organization.stripeCustomerId,
    });

    return session;
}