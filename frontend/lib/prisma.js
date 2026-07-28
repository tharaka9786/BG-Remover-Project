import { PrismaClient } from '../app/generated/prisma/client';

let prisma;

export default function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      datasourceUrl: process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_DATABASE_URL || process.env.DATABASE_URL
    });
  }
  return prisma;
}
