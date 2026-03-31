import { prisma } from "../../lib/prisma";
import { redisClient } from "../../config/redis";
import {
    HealthCheckResponse,
    ReadinessCheckResponse,
} from "./health.types";

export async function getHealthStatus(): Promise<HealthCheckResponse> {
    return {
        success: true,
        status: "ok",
        service: "Operra API",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };
}

export async function getLivenessStatus(): Promise<HealthCheckResponse> {
    return {
        success: true,
        status: "ok",
        service: "Operra API",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    };
}

export async function getReadinessStatus(): Promise<ReadinessCheckResponse> {
    let database: "up" | "down" = "down";
    let redisStatus: "up" | "down" = "down";

    try {
        await prisma.$queryRaw`SELECT 1`;
        database = "up";
    } catch {
        database = "down";
    }

    try {
        if (redisClient) {
            await redisClient.ping();
            redisStatus = "up";
        }
    } catch {
        redisStatus = "down";
    }

    const overallStatus =
        database === "up" && redisStatus === "up" ? "ok" : "error";

    return {
        success: overallStatus === "ok",
        status: overallStatus,
        service: "Operra API",
        timestamp: new Date().toISOString(),
        dependencies: {
            database,
            redis: redisStatus,
        },
    };
}