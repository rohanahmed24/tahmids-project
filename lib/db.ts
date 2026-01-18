import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });


if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


export async function testConnection() {
  try {
    await prisma.$connect();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}