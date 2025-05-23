import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export { db };
