import "dotenv/config";
import pkg from "@prisma/client";

const { PrismaClient } = pkg;

let prisma: any;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}