import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 1000,
  query_timeout: 2000,
  statement_timeout: 2000,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
