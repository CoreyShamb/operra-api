export type PlanKey =
    | "free"
    | "starter"
    | "growth"
    | "business"
    | "professional";

export type SubscriptionStatus =
    | "inactive"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired";

export type PlanConfig = {
    key: PlanKey;
    name: string;
    stripePriceId?: string;
    monthlyPrice?: number;
    description?: string;
    features?: string[];
};

export type BillingPortalSessionResult = {
    url: string | null;
};

export type CheckoutSessionResult = {
    id: string;
    url: string | null;
};

export type OrganizationSubscription = {
    id: string;
    name: string;
    plan: PlanKey;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    subscriptionStatus: SubscriptionStatus | null;
    createdAt: Date;
    updatedAt: Date;
};

export type CreateCheckoutSessionParams = {
    organizationId: string;
    planKey: PlanKey;
};

export type CreateStripeCheckoutSessionParams = {
    organizationId: string;
    organizationName: string;
    stripeCustomerId?: string;
    priceId: string;
};

export type CreateBillingPortalSessionParams = {
    customerId: string;
};