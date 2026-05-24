import { z } from "zod";

export const createOrganizationSchema = z.object({
    name: z
        .string()
        .min(1, "name is required")
        .max(100, "name must be 100 characters or fewer"),
});

export type CreateOrganizationSchemaInput = z.infer<typeof createOrganizationSchema>;
