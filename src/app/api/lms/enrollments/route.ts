import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyLMSAuth, hasRole } from '@/lib/lms-auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyLMSAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || authUser.id;

    // Students can only see their own enrollments
    if (authUser.role === 'student' && userId !== authUser.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const enrollments = await db.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            modules: {
              orderBy: { order: 'asc' },
              include: {
                lessons: { orderBy: { order: 'asc' } },
              },
            },
            assignments: { where: { status: 'open' } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error('LMS Enrollments error:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyLMSAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, courseId, role } = body as { userId: string; courseId: string; role?: string };

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'userId and courseId are required' }, { status: 400 });
    }

    // Students can only enroll themselves
    if (authUser.role === 'student' && userId !== authUser.id) {
      return NextResponse.json({ error: 'You can only enroll yourself' }, { status: 403 });
    }

    // Only admins can assign tutor role on enrollment
    const safeRole = role === 'tutor' && hasRole(authUser, ['admin']) ? 'tutor' : 'student';

    // Check if already enrolled
    const existing = await db.enrollment.findFirst({
      where: { userId, courseId },
    });

    if (existing) {
      return NextResponse.json({ enrollment: existing, message: 'Already enrolled' });
    }

    const enrollment = await db.enrollment.create({
      data: {
        userId,
        courseId,
        role: safeRole,
      },
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error('LMS Enroll error:', error);
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}
