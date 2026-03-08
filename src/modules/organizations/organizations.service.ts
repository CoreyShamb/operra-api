import prisma from "../../lib/prisma";

export class OrganizationsService {
    async createOrganization(userId: string, name: string) {
        return prisma.organization.create({
            data: {
                name,
                memberships: {
                    create: {
                        userId,
                        role: "owner",
                    },
                },
            },
            include: {
                memberships: true,
            },
        });
    }

    async getUserOrganizations(userId: string) {
        const memberships = await prisma.membership.findMany({
            where: { userId },
            include: {
                organization: true
            }
        });

        return memberships.map(m => ({
            organizationId: m.organization.id,
            name: m.organization.name,
            role: m.role
        }));
    }
}