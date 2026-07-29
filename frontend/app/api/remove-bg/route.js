import { NextResponse } from 'next/server';
import { verifyToken } from '../../../lib/auth';
import getPrisma from '../../../lib/prisma';

export async function POST(req) {
  try {
    // 1. Verify User is Logged In
    const token = req.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'You must be logged in to use this feature.' }, { status: 401 });
    }
    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid authentication.' }, { status: 401 });
    }

    // 2. Check User Credits
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user || user.credits <= 0) {
      return NextResponse.json({ error: 'You have 0 credits remaining. Please upgrade your account.' }, { status: 402 });
    }

    const formData = await req.formData();
    const imageFile = formData.get('file');

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Prepare data for Remove.bg API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'auto');

    const apiKey = process.env.REMOVE_BG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is not configured on the server.' }, { status: 500 });
    }

    // Call the official Remove.bg API securely
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Remove.bg API Error:', errorText);
      return NextResponse.json({ error: 'Failed to process image with Remove.bg' }, { status: response.status });
    }

    // 3. Deduct 1 Credit upon success
    await prisma.user.update({
      where: { id: user.id },
      data: { credits: { decrement: 1 } }
    });

    // Return the clean image buffer back to the client
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
      },
    });

  } catch (error) {
    console.error("Next.js API Route Error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
