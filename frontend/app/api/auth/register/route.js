import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import getPrisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ detail: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const prisma = getPrisma();
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ detail: 'Email already registered' }, { status: 400 });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in Vercel Postgres
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash
      }
    });

    return NextResponse.json({ message: 'User registered successfully', userId: user.id }, { status: 201 });
    
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
