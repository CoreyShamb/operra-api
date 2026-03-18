import { prisma } from "../../lib/prisma";
import {
    createStripeCheckoutSession,
    createStripeBillingPortalSession,
} from "./stripe.service";
import { getPlanByKey } from "./plan.config";
import {
    OrganizationSubscription,
    PlanKey,
} from "./billing.types";

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

export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
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

    if (!plan.stripePriceId) {
        throw new Error("Plan is missing Stripe price ID");
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