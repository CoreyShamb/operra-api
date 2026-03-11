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

export async function getDailyUsageAnalytics(
    organizationId: string,
    days: number = 7
) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    const logs = await prisma.apiRequestLog.findMany({
        where: {
            organizationId,
            createdAt: {
                gte: startDate,
            },
        },
        select: {
            createdAt: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const countsByDate = new Map<string, number>();

    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const key = date.toISOString().split("T")[0];
        countsByDate.set(key, 0);
    }

    for (const log of logs) {
        const key = log.createdAt.toISOString().split("T")[0];
        countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
    }

    return Array.from(countsByDate.entries()).map(([date, count]) => ({
        date,
        count,
    }));
}

export async function getEndpointDailyUsageAnalytics(
    organizationId: string,
    days: number = 7,
    path?: string
) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    const logs = await prisma.apiRequestLog.findMany({
        where: {
            organizationId,
            createdAt: {
                gte: startDate,
            },
            ...(path ? { path } : {}),
        },
        select: {
            createdAt: true,
            path: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const endpointPaths = path
        ? [path]
        : Array.from(new Set(logs.map((log) => log.path)));

    const results: Array<{ date: string; path: string; count: number }> = [];

    for (const endpointPath of endpointPaths) {
        const countsByDate = new Map<string, number>();

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const key = date.toISOString().split("T")[0];
            countsByDate.set(key, 0);
        }

        for (const log of logs) {
            if (log.path !== endpointPath) continue;

            const key = log.createdAt.toISOString().split("T")[0];
            countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
        }

        for (const [date, count] of Array.from(countsByDate.entries())) {
            results.push({
                date,
                path: endpointPath,
                count,
            });
        }
    }

    return results;
}

export async function getStatusCodeDailyAnalytics(
    organizationId: string,
    days: number = 7,
    statusCode?: number
) {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    const logs = await prisma.apiRequestLog.findMany({
        where: {
            organizationId,
            createdAt: {
                gte: startDate,
            },
            ...(typeof statusCode === "number" ? { statusCode } : {}),
        },
        select: {
            createdAt: true,
            statusCode: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const statusCodes = typeof statusCode === "number"
        ? [statusCode]
        : Array.from(new Set(logs.map((log) => log.statusCode)));

    const results: Array<{ date: string; statusCode: number; count: number }> = [];

    for (const currentStatusCode of statusCodes) {
        const countsByDate = new Map<string, number>();

        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const key = date.toISOString().split("T")[0];
            countsByDate.set(key, 0);
        }

        for (const log of logs) {
            if (log.statusCode !== currentStatusCode) continue;

            const key = log.createdAt.toISOString().split("T")[0];
            countsByDate.set(key, (countsByDate.get(key) ?? 0) + 1);
        }

        for (const [date, count] of Array.from(countsByDate.entries())) {
            results.push({
                date,
                statusCode: currentStatusCode,
                count,
            });
        }
    }

    return results;
}