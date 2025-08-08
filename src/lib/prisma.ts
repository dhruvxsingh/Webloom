import { PrismaClient } from '@prisma/client';

declare global {
  // Ensures the client is not re-created on hot-reloads in dev
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;