import { z } from "zod";

export const createCustomerSchema = z.object({
  organizationId: z.string().uuid("organizationId must be a valid UUID"),

  firstName: z
    .string()
    .min(1, "firstName is required")
    .max(100, "firstName must be 100 characters or fewer"),

  lastName: z
    .string()
    .min(1, "lastName is required")
    .max(100, "lastName must be 100 characters or fewer"),

  email: z
    .string()
    .email("email must be valid")
    .max(255, "email must be 255 characters or fewer")
    .optional(),

  phone: z
    .string()
    .max(50, "phone must be 50 characters or fewer")
    .optional(),

  notes: z
    .string()
    .max(2000, "notes must be 2000 characters or fewer")
    .optional(),
});

export const updateCustomerSchema = z.object({
  firstName: z
    .string()
    .min(1, "firstName cannot be empty")
    .max(100, "firstName must be 100 characters or fewer")
    .optional(),

  lastName: z
    .string()
    .min(1, "lastName cannot be empty")
    .max(100, "lastName must be 100 characters or fewer")
    .optional(),

  email: z
    .string()
    .email("email must be valid")
    .max(255, "email must be 255 characters or fewer")
    .optional(),

  phone: z
    .string()
    .max(50, "phone must be 50 characters or fewer")
    .optional(),

  notes: z
    .string()
    .max(2000, "notes must be 2000 characters or fewer")
    .optional(),
});

export const customerQuerySchema = z.object({
  organizationId: z.string().uuid("organizationId must be a valid UUID"),

  search: z.string().optional(),

  page: z.coerce
    .number()
    .int()
    .min(1, "page must be at least 1")
    .optional()
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1, "limit must be at least 1")
    .max(100, "limit cannot exceed 100")
    .optional()
    .default(20),
});

export type CreateCustomerSchemaInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerSchemaInput = z.infer<typeof updateCustomerSchema>;
export type CustomerQuerySchemaInput = z.infer<typeof customerQuerySchema>;