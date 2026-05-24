import { prisma } from "../lib/prisma";
import { sendMailgunEmail } from "../modules/integrations/mailgun/mailgun.service";
import { sendTwilioSms } from "../modules/integrations/twilio/twilio.service";

async function runReminderJob() {
    try {
        const now = new Date();
        const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
        const in2Hours = new Date(now.getTime() + 2 * 60 * 60 * 1000);

        const upcomingBookings = await prisma.booking.findMany({
            where: {
                status: "confirmed",
                startTime: { gte: in1Hour, lte: in2Hours },
                customerId: { not: null },
            },
            include: {
                organization: { select: { name: true } },
            },
        });

        if (upcomingBookings.length === 0) return;

        console.log(
            `[reminder.job] sending reminders for ${upcomingBookings.length} booking(s)`
        );

        const customerIds = [...new Set(upcomingBookings.map((b) => b.customerId!))];

        const customers = await prisma.customer.findMany({
            where: { id: { in: customerIds } },
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        });

        const customerMap = new Map(customers.map((c) => [c.id, c]));

        await Promise.allSettled(
            upcomingBookings.map(async (booking) => {
                const customer = customerMap.get(booking.customerId!);
                if (!customer) return;

                const startTime = booking.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                });

                const reminderText = [
                    `Hi ${customer.firstName},`,
                    "",
                    `This is a reminder that your appointment "${booking.title}" with ${booking.organization.name} starts at ${startTime} today.`,
                    booking.notes ? `Notes: ${booking.notes}` : "",
                    "",
                    "See you soon!",
                ]
                    .filter(Boolean)
                    .join("\n");

                if (customer.email) {
                    try {
                        await sendMailgunEmail({
                            to: customer.email,
                            subject: `Reminder: your appointment at ${startTime}`,
                            text: reminderText,
                        });
                        console.log(
                            `[reminder.job] email sent to ${customer.email} for booking ${booking.id}`
                        );
                    } catch (err) {
                        console.error(
                            `[reminder.job] email failed for booking ${booking.id}:`,
                            err
                        );
                    }
                }

                if (customer.phone) {
                    try {
                        await sendTwilioSms({
                            to: customer.phone,
                            body: `Hi ${customer.firstName}, reminder: "${booking.title}" with ${booking.organization.name} starts at ${startTime}. See you soon!`,
                        });
                        console.log(
                            `[reminder.job] SMS sent to ${customer.phone} for booking ${booking.id}`
                        );
                    } catch (err) {
                        console.error(
                            `[reminder.job] SMS failed for booking ${booking.id}:`,
                            err
                        );
                    }
                }
            })
        );
    } catch (error) {
        console.error("[reminder.job] run failed:", error);
    }
}

export function registerReminderJob(intervalMs = 60 * 60 * 1000) {
    console.log("[reminder.job] registered — interval:", intervalMs, "ms");
    runReminderJob();
    setInterval(runReminderJob, intervalMs);
}
