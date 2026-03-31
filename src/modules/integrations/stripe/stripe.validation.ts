import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
    organizationId: z.string().uuid(),
    priceId: z.string().min(1),
    customerId: z.string().optional(),
});

export const createBillingPortalSchema = z.object({
    customerId: z.string().min(1),
});

export type CreateCheckoutSessionInput = z.infer<
    typeof createCheckoutSessionSchema
>;

export type CreateBillingPortalInput = z.infer<
    typeof createBillingPortalSchema
>;