export type CreateCheckoutSessionInput = {
    organizationId: string;
    priceId: string;
    customerId?: string;
};

export type CreateCheckoutSessionResult = {
    url: string;
};

export type CreateBillingPortalSessionInput = {
    customerId: string;
};

export type CreateBillingPortalSessionResult = {
    url: string;
};