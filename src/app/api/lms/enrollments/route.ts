import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
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
    const body = await request.json();
    const { userId, courseId, role } = body as { userId: string; courseId: string; role?: string };

    if (!userId || !courseId) {
      return NextResponse.json({ error: 'userId and courseId are required' }, { status: 400 });
    }

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
        role: role || 'student',
      },
    });

    return NextResponse.json({ enrollment });
  } catch (error) {
    console.error('LMS Enroll error:', error);
    return NextResponse.json({ error: 'Failed to enroll' }, { status: 500 });
  }
}
