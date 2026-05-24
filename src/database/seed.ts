import "dotenv/config";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { prisma } from "./prisma";

function hashApiKey(rawKey: string) {
    return crypto.createHash("sha256").update(rawKey).digest("hex");
}

function generateApiKey() {
    const prefix = `op_live_${crypto.randomBytes(4).toString("hex")}`;
    const secret = crypto.randomBytes(24).toString("hex");
    const rawKey = `${prefix}.${secret}`;
    return { rawKey, prefix, keyHash: hashApiKey(rawKey) };
}

function daysFromNow(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function hoursFromNow(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function main() {
    console.log("Seeding database...");

    // ── Users ────────────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash("Password123!", 10);

    const owner = await prisma.user.upsert({
        where: { email: "owner@operra.dev" },
        update: {},
        create: {
            email: "owner@operra.dev",
            name: "Alex Owner",
            password: passwordHash,
        },
    });

    const member = await prisma.user.upsert({
        where: { email: "member@operra.dev" },
        update: {},
        create: {
            email: "member@operra.dev",
            name: "Sam Member",
            password: passwordHash,
        },
    });

    console.log(`  Users: ${owner.email}, ${member.email}`);

    // ── Organization ─────────────────────────────────────────────────────────
    const existingOrg = await prisma.organization.findFirst({
        where: { name: "Operra Dev Org" },
    });

    const org = existingOrg ?? await prisma.organization.create({
        data: {
            name: "Operra Dev Org",
            plan: "growth",
            subscriptionStatus: "active",
        },
    });

    console.log(`  Organization: ${org.name} (${org.id})`);

    // ── Memberships ──────────────────────────────────────────────────────────
    await prisma.membership.upsert({
        where: { userId_organizationId: { userId: owner.id, organizationId: org.id } },
        update: {},
        create: { userId: owner.id, organizationId: org.id, role: "owner" },
    });

    await prisma.membership.upsert({
        where: { userId_organizationId: { userId: member.id, organizationId: org.id } },
        update: {},
        create: { userId: member.id, organizationId: org.id, role: "member" },
    });

    console.log("  Memberships: owner, member");

    // ── API Key ──────────────────────────────────────────────────────────────
    const existingApiKey = await prisma.apiKey.findFirst({
        where: { organizationId: org.id },
    });

    let rawKey = "(existing — not shown)";

    if (!existingApiKey) {
        const generated = generateApiKey();
        rawKey = generated.rawKey;

        await prisma.apiKey.create({
            data: {
                organizationId: org.id,
                name: "Dev API Key",
                prefix: generated.prefix,
                keyHash: generated.keyHash,
            },
        });
    }

    console.log(`  API Key raw value: ${rawKey}`);

    // ── Subscription ─────────────────────────────────────────────────────────
    await prisma.subscription.upsert({
        where: { organizationId: org.id },
        update: {},
        create: {
            organizationId: org.id,
            stripeCustomerId: "cus_seed_dev_org",
            stripeSubscriptionId: "sub_seed_dev_org",
            stripePriceId: process.env.STRIPE_PRICE_GROWTH ?? "price_seed_growth",
            planKey: "growth",
            status: "active",
            currentPeriodEnd: daysFromNow(30),
            cancelAtPeriodEnd: false,
        },
    });

    console.log("  Subscription: growth / active");

    // ── Integrations ─────────────────────────────────────────────────────────
    const integrations = [
        { provider: "mailgun", status: "connected", connectedAt: new Date() },
        { provider: "stripe", status: "connected", connectedAt: new Date() },
        { provider: "twilio", status: "disconnected", connectedAt: null },
        { provider: "webhook", status: "disconnected", connectedAt: null },
    ];

    for (const integration of integrations) {
        await prisma.integration.upsert({
            where: { organizationId_provider: { organizationId: org.id, provider: integration.provider } },
            update: {},
            create: { organizationId: org.id, ...integration },
        });
    }

    console.log("  Integrations: mailgun (connected), stripe (connected), twilio, webhook");

    // ── Customers ────────────────────────────────────────────────────────────
    const customerData = [
        { firstName: "Jordan", lastName: "Carter", email: "jordan@example.com", phone: "+15550001001", notes: "Prefers morning appointments" },
        { firstName: "Riley", lastName: "Thompson", email: "riley@example.com", phone: "+15550001002", notes: null },
        { firstName: "Morgan", lastName: "Davis", email: "morgan@example.com", phone: null, notes: "Referred by Jordan Carter" },
        { firstName: "Casey", lastName: "Wilson", email: null, phone: "+15550001004", notes: null },
        { firstName: "Drew", lastName: "Martinez", email: "drew@example.com", phone: "+15550001005", notes: "VIP client" },
    ];

    const customers = await Promise.all(
        customerData.map(async (c) => {
            const existing = await prisma.customer.findFirst({
                where: { organizationId: org.id, firstName: c.firstName, lastName: c.lastName },
            });

            return existing ?? prisma.customer.create({
                data: { organizationId: org.id, ...c },
            });
        })
    );

    console.log(`  Customers: ${customers.length} created`);

    // ── Bookings ─────────────────────────────────────────────────────────────
    const bookingData = [
        {
            customerId: customers[0].id,
            title: "Initial Consultation",
            status: "completed",
            startTime: daysFromNow(-14),
            endTime: new Date(daysFromNow(-14).getTime() + 60 * 60 * 1000),
            notes: "First visit",
        },
        {
            customerId: customers[1].id,
            title: "Follow-up Session",
            status: "completed",
            startTime: daysFromNow(-7),
            endTime: new Date(daysFromNow(-7).getTime() + 45 * 60 * 1000),
            notes: null,
        },
        {
            customerId: customers[2].id,
            title: "Strategy Review",
            status: "cancelled",
            startTime: daysFromNow(-3),
            endTime: new Date(daysFromNow(-3).getTime() + 90 * 60 * 1000),
            notes: "Client cancelled day before",
        },
        {
            customerId: customers[3].id,
            title: "Onboarding Call",
            status: "confirmed",
            startTime: hoursFromNow(2),
            endTime: new Date(hoursFromNow(2).getTime() + 60 * 60 * 1000),
            notes: null,
        },
        {
            customerId: customers[4].id,
            title: "VIP Quarterly Review",
            status: "confirmed",
            startTime: daysFromNow(3),
            endTime: new Date(daysFromNow(3).getTime() + 120 * 60 * 1000),
            notes: "Prepare Q2 report",
        },
        {
            customerId: customers[0].id,
            title: "Monthly Check-in",
            status: "pending",
            startTime: daysFromNow(7),
            endTime: new Date(daysFromNow(7).getTime() + 30 * 60 * 1000),
            notes: null,
        },
    ];

    const existingBookingCount = await prisma.booking.count({
        where: { organizationId: org.id },
    });

    if (existingBookingCount === 0) {
        await prisma.booking.createMany({
            data: bookingData.map((b) => ({ organizationId: org.id, ...b })),
        });
    }

    console.log(`  Bookings: ${bookingData.length} (completed, cancelled, confirmed, pending)`);

    // ── API Request Logs (analytics sample data) ──────────────────────────────
    const existingLogCount = await prisma.apiRequestLog.count({
        where: { organizationId: org.id },
    });

    if (existingLogCount === 0) {
        const endpoints = [
            { method: "GET", path: "/api/v1/bookings", statusCode: 200 },
            { method: "POST", path: "/api/v1/bookings", statusCode: 201 },
            { method: "GET", path: "/api/v1/customers", statusCode: 200 },
            { method: "POST", path: "/api/v1/customers", statusCode: 201 },
            { method: "GET", path: "/api/v1/analytics/usage", statusCode: 200 },
            { method: "POST", path: "/api/v1/bookings", statusCode: 400 },
            { method: "GET", path: "/api/v1/bookings", statusCode: 401 },
        ];

        const logs: Array<{
            organizationId: string;
            method: string;
            path: string;
            statusCode: number;
            createdAt: Date;
        }> = [];

        for (let i = 29; i >= 0; i--) {
            const date = daysFromNow(-i);
            const dailyCount = Math.floor(Math.random() * 40) + 10;

            for (let j = 0; j < dailyCount; j++) {
                const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
                const entryTime = new Date(date);
                entryTime.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

                logs.push({
                    organizationId: org.id,
                    ...endpoint,
                    createdAt: entryTime,
                });
            }
        }

        await prisma.apiRequestLog.createMany({ data: logs });
        console.log(`  API Request Logs: ${logs.length} entries across 30 days`);
    } else {
        console.log(`  API Request Logs: skipped (${existingLogCount} already exist)`);
    }

    console.log("\nSeed complete.");
    console.log("\nTest credentials:");
    console.log("  owner@operra.dev  /  Password123!");
    console.log("  member@operra.dev /  Password123!");
}

main()
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
