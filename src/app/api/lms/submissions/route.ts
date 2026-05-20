import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyLMSAuth, hasRole, canAccessResource } from '@/lib/lms-auth';

export async function GET(request: NextRequest) {
  try {
    const authUser = await verifyLMSAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const assignmentId = searchParams.get('assignmentId');

    const where: Record<string, unknown> = {};

    // Students can only see their own submissions
    // Tutors can see submissions for their courses
    // Admins can see all submissions
    if (authUser.role === 'student') {
      where.userId = authUser.id; // Students only see their own
    } else if (authUser.role === 'tutor') {
      // Tutors can filter by course - but need to see submissions in their tutored courses
      if (userId) where.userId = userId;
    } else {
      // Admin: can see all, apply filters
      if (userId) where.userId = userId;
    }

    if (assignmentId) where.assignmentId = assignmentId;

    const submissions = await db.assignmentSubmission.findMany({
      where,
      include: {
        assignment: {
          include: { course: true },
        },
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
        tutorFeedback: {
          include: {
            tutor: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { submittedAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('LMS Submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyLMSAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { assignmentId, userId, content } = body as {
      assignmentId: string;
      userId: string;
      content: string;
    };

    if (!assignmentId || !userId || !content) {
      return NextResponse.json({ error: 'assignmentId, userId, and content are required' }, { status: 400 });
    }

    // Students can only submit as themselves; tutors/admins can submit on behalf
    if (authUser.role === 'student' && userId !== authUser.id) {
      return NextResponse.json({ error: 'You can only submit as yourself' }, { status: 403 });
    }

    // Limit content length to prevent abuse
    if (content.length > 100000) {
      return NextResponse.json({ error: 'Submission content is too long (max 100KB)' }, { status: 400 });
    }

    // Check if already submitted
    const existing = await db.assignmentSubmission.findFirst({
      where: { assignmentId, userId },
    });

    if (existing) {
      // Update existing submission
      const updated = await db.assignmentSubmission.update({
        where: { id: existing.id },
        data: { content, status: 'submitted', submittedAt: new Date() },
      });
      return NextResponse.json({ submission: updated });
    }

    const submission = await db.assignmentSubmission.create({
      data: { assignmentId, userId, content },
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('LMS Submit error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}
