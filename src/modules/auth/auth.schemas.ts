import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("email must be valid"),

    name: z
        .string()
        .min(1, "name cannot be empty")
        .max(100, "name must be 100 characters or fewer")
        .optional(),

    password: z
        .string()
        .min(8, "password must be at least 8 characters")
        .max(128, "password must be 128 characters or fewer"),
});

export const loginSchema = z.object({
    email: z.email("email must be valid"),
    password: z.string().min(1, "password is required"),
});

export type RegisterSchemaInput = z.infer<typeof registerSchema>;
export type LoginSchemaInput = z.infer<typeof loginSchema>;
