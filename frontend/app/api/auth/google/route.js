import { NextResponse } from 'next/server';

export async function GET(req) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const origin = new URL(req.url).origin;
  const REDIRECT_URI = `${origin}/api/auth/google/callback`;

  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ error: 'Google OAuth is not configured on the server. Please add GOOGLE_CLIENT_ID to your environment variables.' }, { status: 500 });
  }

  const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  return NextResponse.redirect(`${oauth2Endpoint}?${params.toString()}`);
}
