import { prisma } from "../../database/prisma";

function getStartOfToday() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
}

function getStartOfMonth() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

export async function getUsageAnalytics(organizationId: string) {
    const startOfToday = getStartOfToday();
    const startOfMonth = getStartOfMonth();

    const [todayRequests, monthRequests, topEndpoints, statusCodes] =
        await Promise.all([
            prisma.apiRequestLog.count({
                where: {
                    organizationId,
                    createdAt: {
                        gte: startOfToday,
                    },
                },
            }),

            prisma.apiRequestLog.count({
                where: {
                    organizationId,
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
            }),

            prisma.apiRequestLog.groupBy({
                by: ["path"],
                where: {
                    organizationId,
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
                _count: {
                    path: true,
                },
                orderBy: {
                    _count: {
                        path: "desc",
                    },
                },
                take: 5,
            }),

            prisma.apiRequestLog.groupBy({
                by: ["statusCode"],
                where: {
                    organizationId,
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
                _count: {
                    statusCode: true,
                },
                orderBy: {
                    _count: {
                        statusCode: "desc",
                    },
                },
            }),
        ]);

    return {
        todayRequests,
        monthRequests,
        topEndpoints: topEndpoints.map((item) => ({
            path: item.path,
            count: item._count.path,
        })),
        statusCodes: statusCodes.map((item) => ({
            statusCode: item.statusCode,
            count: item._count.statusCode,
        })),
    };
}