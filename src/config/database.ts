// Connection pool settings used by src/lib/prisma.ts and src/database/prisma.ts
export const DB_CONFIG = {
    connectionTimeoutMillis: 1_000,
    queryTimeout: 2_000,
    statementTimeout: 2_000,
    poolMin: 2,
    poolMax: 10,
} as const;
