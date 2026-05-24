import { prisma } from "../../lib/prisma";

export async function getTodayRequestCount(organizationId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.apiRequestLog.count({
        where: {
            organizationId,
            createdAt: {
                gte: startOfDay,
            },
        },
    });
}

export async function getOrganizationPlan(organizationId: string) {
    const subscription = await prisma.subscription.findUnique({
        where: { organizationId },
    });

    if (!subscription) {
        return "starter";
    }

    return subscription.planKey;
}