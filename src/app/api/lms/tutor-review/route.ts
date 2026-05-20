import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
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
