import { NextRequest, NextResponse } from 'next/server';
import { AI_SYSTEM_PROMPT, getSmartFallbackResponse } from '@/lib/ai/prompts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: ChatMessage[] = body.messages || [];
    const language = body.language || 'pt';

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma mensagem enviada.' },
        { status: 400 }
      );
    }

    const latestUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'user')?.content || '';

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is set, use the intelligent knowledge base fallback
    if (!apiKey) {
      const fallbackReply = getSmartFallbackResponse(latestUserMessage, language);
      return NextResponse.json({
        content: fallbackReply,
        source: 'knowledge-base',
      });
    }

    // Format messages for Google Generative AI (Gemini 1.5 Flash / 2.0 Flash)
    // Gemini roles: "user" and "model"
    const contents = messages.slice(-8).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: AI_SYSTEM_PROMPT }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.9,
        },
      }),
      // Timeout after 10 seconds
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn('Gemini API returned error status:', response.status);
      const fallbackReply = getSmartFallbackResponse(latestUserMessage, language);
      return NextResponse.json({
        content: fallbackReply,
        source: 'knowledge-base',
      });
    }

    const data = await response.json();
    const candidateText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      const fallbackReply = getSmartFallbackResponse(latestUserMessage, language);
      return NextResponse.json({
        content: fallbackReply,
        source: 'knowledge-base',
      });
    }

    // Remove markdown formatting from AI response but preserve lists
    let cleanResponse = candidateText
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/__(.*?)__/g, '$1') // Remove underline
      .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
      .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links, keep text

    // Format lists
    const lines = cleanResponse.split('\n');
    const formattedLines = lines.map((line: string) => {
      const trimmed = line.trim();
      const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.+)/);
      if (numberedMatch) {
        return `${numberedMatch[1]}. ${numberedMatch[2]}`;
      }
      const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
      if (bulletMatch) {
        return `• ${bulletMatch[1]}`;
      }
      return trimmed;
    });

    cleanResponse = formattedLines.join('\n');
    cleanResponse = cleanResponse.replace(/\n{3,}/g, '\n\n');
    cleanResponse = cleanResponse.replace(/([^\n•\d])\n(?![•\d])/g, '$1 ');
    cleanResponse = cleanResponse.trim();

    return NextResponse.json({
      content: cleanResponse,
      source: 'gemini',
    });
  } catch (error) {
    console.error('Chat API error:', error);
    // Graceful recovery
    return NextResponse.json({
      content:
        'Agradeço o seu contacto. De momento estou a recalibrar os nossos dados. Pode colocar a sua questão de outra forma, ou consultar diretamente a nossa secção de Oportunidade e Formulário para falar com a nossa equipa de mentores.',
      source: 'fallback-error',
    });
  }
}
