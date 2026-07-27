import { PrismaClient } from '../app/generated/prisma/client';

let prisma;

export default function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}
