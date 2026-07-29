import { NextResponse } from 'next/server';
import getPrisma from '../../../../lib/prisma';
import { verifyToken, signToken } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json({ detail: 'Unauthorized' }, { status: 401 });
    }

    const { name, avatar, currentPassword, newPassword } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ detail: 'Name cannot be empty' }, { status: 400 });
    }

    const prisma = getPrisma();
    
    // Fetch current user for password check
    const currentUser = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!currentUser) {
      return NextResponse.json({ detail: 'User not found' }, { status: 404 });
    }

    let updatedData = { name: name.trim() };

    // Handle avatar update
    if (avatar !== undefined) {
      updatedData.avatar = avatar;
    }

    // Handle password update
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, currentUser.passwordHash);
      if (!isMatch) {
        return NextResponse.json({ detail: 'Incorrect current password' }, { status: 400 });
      }
      const salt = await bcrypt.genSalt(10);
      updatedData.passwordHash = await bcrypt.hash(newPassword, salt);
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: updatedData,
    });

    // Re-sign token with new name so UI updates instantly
    const newToken = await signToken({ 
      userId: updatedUser.id, 
      email: updatedUser.email, 
      name: updatedUser.name 
    });

    const response = NextResponse.json({ message: 'Profile updated', user: { name: updatedUser.name, email: updatedUser.email, avatar: updatedUser.avatar } }, { status: 200 });
    
    response.cookies.set('auth_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Profile Update Error:', error);
    return NextResponse.json({ detail: 'Internal server error' }, { status: 500 });
  }
}
