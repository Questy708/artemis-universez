import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const course = await db.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
        enrollments: {
          where: userId ? { userId } : undefined,
        },
        assignments: {
          orderBy: { dueDate: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const enrollment = course.enrollments[0];

    return NextResponse.json({
      course: {
        ...course,
        enrolled: !!enrollment,
        progress: enrollment?.progress || 0,
        enrollmentRole: enrollment?.role || null,
      },
    });
  } catch (error) {
    console.error('LMS Course Detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
