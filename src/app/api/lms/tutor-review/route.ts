import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyLMSAuth, hasRole } from '@/lib/lms-auth';

export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyLMSAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only tutors and admins can submit reviews
    if (!hasRole(authUser, ['tutor', 'admin'])) {
      return NextResponse.json({ error: 'Only tutors and admins can review submissions' }, { status: 403 });
    }

    const body = await request.json();
    const { submissionId, tutorId, content, rating, grade } = body as {
      submissionId: string;
      tutorId: string;
      content: string;
      rating?: number;
      grade?: number;
    };

    if (!submissionId || !tutorId || !content) {
      return NextResponse.json({ error: 'submissionId, tutorId, and content are required' }, { status: 400 });
    }

    // Verify the tutorId matches the authenticated user (or is admin)
    if (authUser.role !== 'admin' && tutorId !== authUser.id) {
      return NextResponse.json({ error: 'You can only submit reviews as yourself' }, { status: 403 });
    }

    // Validate rating range
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Validate grade range
    if (grade !== undefined && (grade < 0 || grade > 100)) {
      return NextResponse.json({ error: 'Grade must be between 0 and 100' }, { status: 400 });
    }

    // Limit content length
    if (content.length > 50000) {
      return NextResponse.json({ error: 'Review content is too long (max 50KB)' }, { status: 400 });
    }

    // Create tutor feedback
    const feedback = await db.tutorFeedback.create({
      data: {
        tutorId,
        submissionId,
        content,
        rating,
      },
    });

    // Update submission status and optionally grade
    const updateData: Record<string, unknown> = {
      status: 'tutor_reviewed',
      feedback: content,
    };

    if (grade !== undefined) {
      updateData.grade = grade;
      updateData.gradedAt = new Date();
      updateData.status = 'graded';
    }

    await db.assignmentSubmission.update({
      where: { id: submissionId },
      data: updateData,
    });

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('LMS Tutor Review error:', error);
    return NextResponse.json({ error: 'Failed to submit tutor review' }, { status: 500 });
  }
}
