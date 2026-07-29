import { NextResponse } from 'next/server';
import getPrisma from '../../../../../lib/prisma';
import { signToken } from '../../../../../lib/auth';

export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=NoCodeProvided', req.url));
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google/callback`;

  try {
    // 1. Exchange auth code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error('Google OAuth Token Error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=GoogleAuthFailed', req.url));
    }

    // 2. Fetch user profile from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const googleUser = await userResponse.json();
    if (!googleUser.email) {
      return NextResponse.redirect(new URL('/login?error=EmailNotProvided', req.url));
    }

    // 3. Find or Create User in our Database
    const prisma = getPrisma();
    let user = await prisma.user.findUnique({ where: { email: googleUser.email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name || 'Google User',
          avatar: googleUser.picture || null,
          credits: 5, // Default signup credits
        }
      });
    }

    // 4. Generate JWT & Set Cookie
    const token = await signToken({ userId: user.id, email: user.email, name: user.name });

    const response = NextResponse.redirect(new URL('/', req.url));
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;

  } catch (error) {
    console.error('Google Auth Callback Error:', error);
    return NextResponse.redirect(new URL('/login?error=InternalServerError', req.url));
  }
}
