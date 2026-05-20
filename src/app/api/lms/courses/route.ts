import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const userId = searchParams.get('userId');

    const courses = await db.course.findMany({
      where: {
        status: 'active',
        ...(role === 'student' || !role ? {} : {}),
      },
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
          where: { status: 'open' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Add enrollment and progress info
    const enrichedCourses = courses.map((course) => {
      const enrollment = course.enrollments[0];
      return {
        ...course,
        enrolled: !!enrollment,
        progress: enrollment?.progress || 0,
        enrollmentStatus: enrollment?.status || null,
      };
    });

    return NextResponse.json({ courses: enrichedCourses });
  } catch (error) {
    console.error('LMS Courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
