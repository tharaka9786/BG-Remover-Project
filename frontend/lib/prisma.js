import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';
import { PrismaClient } from '../app/generated/prisma/client';

// Required for Neon WebSocket connection in Node.js environments
neonConfig.webSocketConstructor = ws;

let prisma;

export default function getPrisma() {
  if (!prisma) {
    let connectionString = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL || process.env.POSTGRES_DATABASE_URL || process.env.DATABASE_URL;

    // Bulletproof fallback: If Vercel named the variable something totally random (like STORAGE_URL),
    // this will actively scan all environment variables to find the database connection string.
    if (!connectionString) {
      for (const key of Object.keys(process.env)) {
        const val = process.env[key];
        if (typeof val === 'string' && (val.startsWith('postgres://') || val.startsWith('postgresql://'))) {
          connectionString = val;
          // Prefer the pooled connection over the unpooled one
          if (!key.includes('UNPOOLED')) {
            break;
          }
        }
      }
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}
