import getPrisma from './lib/prisma.js';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const prisma = getPrisma();
    console.log('Connecting...');
    const users = await prisma.user.findMany();
    console.log('Users:', users);
  } catch (e) {
    console.error('ERROR:', e);
  }
}
main();
