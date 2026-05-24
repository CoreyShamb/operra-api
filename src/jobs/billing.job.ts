import { prisma } from "../lib/prisma";

async function runBillingJob() {
    try {
        const now = new Date();

        const expired = await prisma.subscription.findMany({
            where: {
                status: "active",
                currentPeriodEnd: { lt: now },
            },
            select: {
                id: true,
                organizationId: true,
                stripeSubscriptionId: true,
            },
        });

        if (expired.length === 0) return;

        console.log(`[billing.job] expiring ${expired.length} subscription(s)`);

        await Promise.allSettled(
            expired.map(async (sub) => {
                try {
                    await prisma.subscription.update({
                        where: { id: sub.id },
                        data: { status: "past_due" },
                    });

                    await prisma.organization.update({
                        where: { id: sub.organizationId },
                        data: { plan: "free", subscriptionStatus: "past_due" },
                    });

                    console.log(
                        `[billing.job] downgraded org ${sub.organizationId} (sub ${sub.stripeSubscriptionId})`
                    );
                } catch (err) {
                    console.error(`[billing.job] failed to expire sub ${sub.id}:`, err);
                }
            })
        );
    } catch (error) {
        console.error("[billing.job] run failed:", error);
    }
}

export function registerBillingJob(intervalMs = 6 * 60 * 60 * 1000) {
    console.log("[billing.job] registered — interval:", intervalMs, "ms");
    runBillingJob();
    setInterval(runBillingJob, intervalMs);
}
