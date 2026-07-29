import { NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/auth';
import getPrisma from '../../../../lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const payload = await verifyToken(token);

  if (!payload || !payload.userId) {
    // If token is invalid, also clear the cookie
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.cookies.delete('auth_token');
    return response;
  }

  // Fetch the latest credits from the database
  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, name: true, email: true, credits: true, avatar: true }
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: payload }, { status: 200 });
  }
}
