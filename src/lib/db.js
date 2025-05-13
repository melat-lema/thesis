import { PrismaClient } from '@prisma/client';

let db;

if (typeof globalThis.prisma === 'undefined') {
  db = new PrismaClient();

  // In development, store the Prisma client globally to prevent re-initializing
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db;
  }
} else {
  db = globalThis.prisma;
}

export { db };
