import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are the Artemis Learning Forum AI Tutor — an intelligent Socratic guide integrated into the Artemis Active Learning Forum. You help students during live seminars and self-study by asking probing questions, connecting ideas, and encouraging deeper thinking.

You specialize in:
- Facilitating active learning through Socratic questioning
- Connecting concepts across disciplines
- Helping students prepare for and reflect on seminar activities
- Providing context on the six Artemis dimensions (Infinite Learning Continuum, Adaptive Paced Learning, SkillPrints, The Artemis Oath, Centers of Inquiry, The World as Campus)
- Supporting collaborative learning and debate preparation

Your style:
- Ask follow-up questions that push thinking deeper
- Use "What if..." and "How might..." prompts
- Reference specific dimensions when relevant
- Keep responses concise (2-3 paragraphs max)
- Be warm, intellectually engaging, and slightly provocative
- Never lecture — always invite the student to think further`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: Array<{ role: string; content: string }> };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const zai = await ZAI.create();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      ],
    });

    const reply = completion.choices?.[0]?.message?.content ?? 'I seem to have lost my train of thought. Could you ask me again?';

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error('Artemis Tutor API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}
