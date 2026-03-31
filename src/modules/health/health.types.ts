export type HealthStatus = "ok" | "error";

export type DependencyStatus = "up" | "down";

export type HealthCheckResponse = {
    success: boolean;
    status: HealthStatus;
    service: string;
    timestamp: string;
    uptime: number;
};

export type ReadinessCheckResponse = {
    success: boolean;
    status: HealthStatus;
    service: string;
    timestamp: string;
    dependencies: {
        database: DependencyStatus;
        redis: DependencyStatus;
    };
};