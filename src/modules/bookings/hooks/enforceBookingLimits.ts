import { prisma } from "../../../lib/prisma";
import { getPlanByKey } from "../../billing/plan.config";

export async function enforceBookingLimits(organizationId: string) {
    const organization = await prisma.organization.findUnique({
        where: { id: organizationId },
        select: {
            id: true,
            plan: true,
            subscription: {
                select: {
                    planKey: true,
                    status: true,
                },
            },
        },
    });

    if (!organization) {
        throw new Error("Organization not found");
    }

    const activePlanKey =
        organization.subscription?.status === "active"
            ? organization.subscription.planKey
            : organization.plan || "free";

    const plan = getPlanByKey(activePlanKey);

    if (!plan) {
        throw new Error("Invalid organization plan");
    }

    if (plan.bookingLimit === null) {
        return;
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const bookingCount = await prisma.booking.count({
        where: {
            organizationId,
            createdAt: {
                gte: startOfMonth,
            },
        },
    });

    if (bookingCount >= plan.bookingLimit) {
        throw new Error(
            `Booking limit reached for the ${plan.key} plan. Upgrade to continue.`
        );
    }
}