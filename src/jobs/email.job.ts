import { prisma } from "../lib/prisma";
import { sendMailgunEmail } from "../modules/integrations/mailgun/mailgun.service";

async function runEmailJob() {
    try {
        const now = new Date();
        const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const in6Days = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

        const renewingSoon = await prisma.subscription.findMany({
            where: {
                status: "active",
                cancelAtPeriodEnd: false,
                currentPeriodEnd: { gte: in6Days, lte: in7Days },
            },
            include: {
                organization: {
                    include: {
                        memberships: {
                            where: { role: "owner" },
                            include: {
                                user: { select: { email: true, name: true } },
                            },
                        },
                    },
                },
            },
        });

        if (renewingSoon.length === 0) return;

        console.log(
            `[email.job] sending renewal reminders for ${renewingSoon.length} subscription(s)`
        );

        await Promise.allSettled(
            renewingSoon.map(async (sub) => {
                const owners = sub.organization.memberships.map((m) => m.user);
                const renewalDate = sub.currentPeriodEnd
                    ? sub.currentPeriodEnd.toDateString()
                    : "soon";

                await Promise.allSettled(
                    owners.map(async (owner) => {
                        try {
                            await sendMailgunEmail({
                                to: owner.email,
                                subject: `Your ${sub.organization.name} subscription renews on ${renewalDate}`,
                                text: [
                                    `Hi ${owner.name ?? "there"},`,
                                    "",
                                    `This is a reminder that your Operra subscription for ${sub.organization.name} will renew on ${renewalDate}.`,
                                    "",
                                    "If you need to update your payment details, visit your billing portal.",
                                    "",
                                    "Thanks,",
                                    "The Operra Team",
                                ].join("\n"),
                            });

                            console.log(
                                `[email.job] renewal reminder sent to ${owner.email} for org ${sub.organizationId}`
                            );
                        } catch (err) {
                            console.error(
                                `[email.job] failed to send to ${owner.email}:`,
                                err
                            );
                        }
                    })
                );
            })
        );
    } catch (error) {
        console.error("[email.job] run failed:", error);
    }
}

export function registerEmailJob(intervalMs = 24 * 60 * 60 * 1000) {
    console.log("[email.job] registered — interval:", intervalMs, "ms");
    runEmailJob();
    setInterval(runEmailJob, intervalMs);
}
