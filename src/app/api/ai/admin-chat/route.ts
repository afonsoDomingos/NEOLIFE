import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_AI_SYSTEM_PROMPT, getAdminFallbackResponse } from '@/lib/ai/prompts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  // Security: only authenticated admins may call this endpoint
  const adminSession = req.cookies.get('admin_session');
  if (!adminSession?.value) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Nenhuma mensagem enviada.' }, { status: 400 });
    }

    const latestUserMessage =
      messages
        .slice()
        .reverse()
        .find((m) => m.role === 'user')?.content || '';

    const apiKey = process.env.GEMINI_API_KEY;

    // Fallback quando não há API key configurada
    if (!apiKey) {
      return NextResponse.json({
        reply: getAdminFallbackResponse(latestUserMessage),
        source: 'knowledge-base',
      });
    }

    // Formatar mensagens para o Gemini (roles: "user" e "model")
    const contents = messages.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: ADMIN_AI_SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.8,      // ligeiramente mais criativo para redigir mensagens
          maxOutputTokens: 700,  // respostas mais longas para rascunhos de mensagens
          topP: 0.9,
        },
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!response.ok) {
      console.warn('[Admin AI] Gemini API error:', response.status);
      return NextResponse.json({
        reply: getAdminFallbackResponse(latestUserMessage),
        source: 'knowledge-base',
      });
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return NextResponse.json({
        reply: getAdminFallbackResponse(latestUserMessage),
        source: 'knowledge-base',
      });
    }

    return NextResponse.json({
      reply: candidateText.trim(),
      source: 'gemini',
    });
  } catch (error) {
    console.error('[Admin AI] Error:', error);
    return NextResponse.json({
      reply: 'Erro de ligação à IA. Tente novamente em instantes.',
      source: 'fallback-error',
    });
  }
}

