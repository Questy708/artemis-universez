import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role } = body as { email: string; name: string; role?: string };

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Try to find existing user
    let user = await db.lMSUser.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user
      user = await db.lMSUser.create({
        data: {
          email,
          name,
          role: role || 'student',
        },
      });
    } else if (role && user.role !== role) {
      // Update role if provided and different
      user = await db.lMSUser.update({
        where: { id: user.id },
        data: { role, lastActiveAt: new Date() },
      });
    } else {
      // Update lastActiveAt
      user = await db.lMSUser.update({
        where: { id: user.id },
        data: { lastActiveAt: new Date() },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('LMS Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
