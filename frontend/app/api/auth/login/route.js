import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ detail: 'Missing email or password' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ detail: 'Invalid credentials' }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ detail: 'Invalid credentials' }, { status: 401 });
    }

    // Normally you would return a JWT session token here.
    // For now, we return a success response which the frontend handles.
    return NextResponse.json({ message: 'Login successful', userId: user.id }, { status: 200 });
    
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
