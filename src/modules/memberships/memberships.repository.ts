import { prisma } from "../../lib/prisma";
import { MembershipRole } from "./memberships.types";

export async function findMembershipsByOrganization(organizationId: string) {
    return prisma.membership.findMany({
        where: { organizationId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });
}

export async function findMembershipById(id: string) {
    return prisma.membership.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });
}

export async function findMembershipByUserAndOrg(params: {
    userId: string;
    organizationId: string;
}) {
    return prisma.membership.findUnique({
        where: {
            userId_organizationId: {
                userId: params.userId,
                organizationId: params.organizationId,
            },
        },
    });
}

export async function createMembership(data: {
    userId: string;
    organizationId: string;
    role: MembershipRole;
}) {
    return prisma.membership.create({
        data,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });
}

export async function updateMembership(id: string, data: { role: MembershipRole }) {
    return prisma.membership.update({
        where: { id },
        data,
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });
}

export async function deleteMembership(id: string) {
    return prisma.membership.delete({
        where: { id },
    });
}

export async function countOwners(organizationId: string) {
    return prisma.membership.count({
        where: { organizationId, role: "owner" },
    });
}
