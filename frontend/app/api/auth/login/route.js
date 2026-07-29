import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import getPrisma from '../../../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ detail: 'Missing email or password' }, { status: 400 });
    }

    // Find the user
    const prisma = getPrisma();
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

    // Generate JWT token
    const { signToken } = await import('../../../../lib/auth');
    const token = await signToken({ userId: user.id, email: user.email, name: user.name });

    const response = NextResponse.json({ message: 'Login successful', userId: user.id }, { status: 200 });
    
    // Set HTTP-Only Cookie
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
