import { findUserByEmail } from "../users/users.repository";
import {
    countOwners,
    createMembership,
    deleteMembership,
    findMembershipById,
    findMembershipByUserAndOrg,
    findMembershipsByOrganization,
    updateMembership,
} from "./memberships.repository";
import {
    AddMemberInput,
    MembershipQueryParams,
    UpdateMemberRoleInput,
} from "./memberships.types";

export async function getMembers(params: MembershipQueryParams) {
    return findMembershipsByOrganization(params.organizationId);
}

export async function addMember(input: AddMemberInput) {
    const user = await findUserByEmail(input.email);

    if (!user) {
        throw new Error("No user found with that email address");
    }

    const existing = await findMembershipByUserAndOrg({
        userId: user.id,
        organizationId: input.organizationId,
    });

    if (existing) {
        throw new Error("User is already a member of this organization");
    }

    return createMembership({
        userId: user.id,
        organizationId: input.organizationId,
        role: input.role,
    });
}

export async function updateMemberRole(id: string, input: UpdateMemberRoleInput) {
    const membership = await findMembershipById(id);

    if (!membership) {
        throw new Error("Membership not found");
    }

    // Prevent removing the last owner
    if (membership.role === "owner" && input.role !== "owner") {
        const ownerCount = await countOwners(membership.organizationId);

        if (ownerCount <= 1) {
            throw new Error("Organization must have at least one owner");
        }
    }

    return updateMembership(id, { role: input.role });
}

export async function removeMember(id: string) {
    const membership = await findMembershipById(id);

    if (!membership) {
        throw new Error("Membership not found");
    }

    if (membership.role === "owner") {
        const ownerCount = await countOwners(membership.organizationId);

        if (ownerCount <= 1) {
            throw new Error("Cannot remove the last owner of an organization");
        }
    }

    return deleteMembership(id);
}
