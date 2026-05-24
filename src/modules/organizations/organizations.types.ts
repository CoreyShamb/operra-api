export type Organization = {
    id: string;
    name: string;
    plan: string;
    subscriptionStatus: string | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type Membership = {
    id: string;
    userId: string;
    organizationId: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
};

export type UserOrganization = {
    organizationId: string;
    name: string;
    role: string;
};

export type CreateOrganizationInput = {
    name: string;
};
