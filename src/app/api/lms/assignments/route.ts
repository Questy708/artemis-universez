import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const userId = searchParams.get('userId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const assignments = await db.assignment.findMany({
      where: { courseId },
      include: {
        submissions: userId ? { where: { userId } } : true,
      },
      orderBy: { dueDate: 'asc' },
    });

    return NextResponse.json({ assignments });
  } catch (error) {
    console.error('LMS Assignments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}
