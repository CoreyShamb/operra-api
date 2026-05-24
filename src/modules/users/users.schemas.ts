import { z } from "zod";

export const updateProfileSchema = z.object({
    name: z
        .string()
        .min(1, "name cannot be empty")
        .max(100, "name must be 100 characters or fewer")
        .optional(),

    email: z
        .email("email must be valid")
        .max(255, "email must be 255 characters or fewer")
        .optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "currentPassword is required"),

    newPassword: z
        .string()
        .min(8, "newPassword must be at least 8 characters")
        .max(128, "newPassword must be 128 characters or fewer"),
});

export type UpdateProfileSchemaInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordSchemaInput = z.infer<typeof changePasswordSchema>;
