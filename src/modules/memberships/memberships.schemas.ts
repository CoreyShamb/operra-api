import { z } from "zod";

const membershipRoleSchema = z.enum(["owner", "admin", "member"]);

export const addMemberSchema = z.object({
    organizationId: z.string().uuid("organizationId must be a valid UUID"),
    email: z.email("email must be valid"),
    role: membershipRoleSchema,
});

export const updateMemberRoleSchema = z.object({
    role: membershipRoleSchema,
});

export const membershipQuerySchema = z.object({
    organizationId: z.string().uuid("organizationId must be a valid UUID"),
});

export type AddMemberSchemaInput = z.infer<typeof addMemberSchema>;
export type UpdateMemberRoleSchemaInput = z.infer<typeof updateMemberRoleSchema>;
export type MembershipQuerySchemaInput = z.infer<typeof membershipQuerySchema>;
