import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Allowed roles that a user can self-assign during onboarding
const SELF_ASSIGNABLE_ROLES = ['student', 'tutor'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, role } = body as { email: string; name: string; role?: string };

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Sanitize: only allow self-assignable roles (prevent admin escalation)
    const safeRole = role && SELF_ASSIGNABLE_ROLES.includes(role) ? role : 'student';

    // Try to find existing user
    let user = await db.lMSUser.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user with safe role
      user = await db.lMSUser.create({
        data: {
          email,
          name,
          role: safeRole,
        },
      });
    } else {
      // Existing user: do NOT allow role change via this endpoint
      // Role changes must go through an admin API
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
