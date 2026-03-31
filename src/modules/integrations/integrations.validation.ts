import { z } from "zod";

const integrationProviderSchema = z.enum([
    "stripe",
    "twilio",
    "mailgun",
    "webhook",
]);

export const integrationQuerySchema = z.object({
    organizationId: z.string().uuid("organizationId must be a valid UUID"),
});

export const connectIntegrationSchema = z.object({
    organizationId: z.string().uuid("organizationId must be a valid UUID"),
    provider: integrationProviderSchema,
});

export const disconnectIntegrationSchema = z.object({
    organizationId: z.string().uuid("organizationId must be a valid UUID"),
    provider: integrationProviderSchema,
});

export type IntegrationQuerySchemaInput = z.infer<
    typeof integrationQuerySchema
>;
export type ConnectIntegrationSchemaInput = z.infer<
    typeof connectIntegrationSchema
>;
export type DisconnectIntegrationSchemaInput = z.infer<
    typeof disconnectIntegrationSchema
>;