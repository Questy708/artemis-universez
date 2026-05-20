import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyLMSAuth, hasRole } from '@/lib/lms-auth';
import ZAI from 'z-ai-web-dev-sdk';

const AI_REVIEW_PROMPT = `You are an AI academic reviewer for the Artemis Learning Management System. You provide constructive, detailed feedback on student submissions. Your review should:

1. Acknowledge strengths in the work
2. Identify specific areas for improvement
3. Provide actionable suggestions
4. Connect feedback to the course themes and the Artemis Oath where relevant
5. Be encouraging while maintaining academic rigor

Keep your review concise (3-4 paragraphs) but thorough. Use a warm, intellectually engaging tone.`;

export async function POST(request: NextRequest) {
  try {
    const authUser = await verifyLMSAuth(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Only tutors and admins can trigger AI reviews
    if (!hasRole(authUser, ['tutor', 'admin'])) {
      return NextResponse.json({ error: 'Only tutors and admins can trigger AI reviews' }, { status: 403 });
    }

    const body = await request.json();
    const { submissionId } = body as { submissionId: string };

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 });
    }

    const submission = await db.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: {
          include: { course: true },
        },
      },
    });

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    // Parse submission content
    let contentText = submission.content;
    try {
      const parsed = JSON.parse(submission.content);
      contentText = parsed.text || parsed.content || submission.content;
    } catch {
      // content is plain text
    }

    // Limit content sent to AI to prevent token abuse
    const maxContentLength = 30000;
    if (contentText.length > maxContentLength) {
      contentText = contentText.slice(0, maxContentLength) + '\n\n[Content truncated for review]';
    }

    // Generate AI feedback
    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: AI_REVIEW_PROMPT },
        {
          role: 'user',
          content: `Course: ${submission.assignment.course.title}\nAssignment: ${submission.assignment.title}\nAssignment Description: ${submission.assignment.description}\n\nStudent Submission:\n${contentText}`,
        },
      ],
    });

    const aiFeedback = completion.choices?.[0]?.message?.content ?? 'Unable to generate feedback at this time.';

    // Update submission with AI feedback
    const updated = await db.assignmentSubmission.update({
      where: { id: submissionId },
      data: { aiFeedback, status: 'ai_reviewed' },
    });

    return NextResponse.json({ submission: updated, aiFeedback });
  } catch (error) {
    console.error('LMS AI Review error:', error);
    return NextResponse.json({ error: 'Failed to generate AI review' }, { status: 500 });
  }
}
