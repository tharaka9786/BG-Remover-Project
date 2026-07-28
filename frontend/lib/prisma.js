import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '../app/generated/prisma/client';

// Required for Neon WebSocket connection in Node.js environments
neonConfig.webSocketConstructor = ws;

let prisma;

export default function getPrisma() {
  if (!prisma) {
    const connectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.POSTGRES_DATABASE_URL || process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}
