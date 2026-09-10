'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const QUICK_PROMPTS = [
  'O que é a nutrição celular?',
  'Como funciona a oportunidade de negócio?',
  'Como posso encomendar produtos?',
  'Quais os países com apoio direto?',
];

export function ChatAssistant() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Olá! Seja muito bem-vindo à nossa plataforma.\n\nSou o assistente virtual da equipa de mentoria e consultoria NeoLife. Estou aqui para esclarecer dúvidas sobre a nossa abordagem à **nutrição celular**, **qualidade científica** ou sobre a **oportunidade de empreender connosco** em família.\n\nComo posso ajudar hoje?',
      time: 'Agora',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Do not show widget on admin CRM pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error('Falha na resposta');

      const data = await res.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Peço desculpa, ocorreu um pequeno problema. Pode tentar novamente?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          'Ocorreu uma pequena instabilidade na ligação. Pode preencher diretamente o nosso [Formulário de Contacto](/formulario) ou tentar novamente em instantes.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple formatter for markdown bold, italic and [text](link)
  const renderFormattedMessage = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      // Parse markdown links [text](href)
      const linkRegex = /\[(.*?)\]\((.*?)\)/g;
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(formatInline(line.substring(lastIndex, match.index)));
        }
        const text = match[1];
        const href = match[2];
        parts.push(
          <Link
            key={`${lineIdx}-${match.index}`}
            href={href}
            onClick={() => setIsOpen(false)}
            className="text-emerald-600 font-semibold underline hover:text-emerald-800 transition-colors"
          >
            {text}
          </Link>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(formatInline(line.substring(lastIndex)));
      }

      return (
        <p key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>
          {parts.length > 0 ? parts : formatInline(line)}
        </p>
      );
    });
  };

  const formatInline = (text: string) => {
    // Bold **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3">
          <div className="hidden sm:flex items-center bg-white/95 backdrop-blur shadow-lg border border-emerald-100 py-2 px-3.5 rounded-full text-xs font-medium text-gray-700 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Alguma dúvida? Fale connosco
          </div>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir Assistente Consultivo de IA"
            className="relative bg-gradient-to-tr from-emerald-700 to-emerald-500 text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-emerald-300"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[94vw] sm:w-[410px] max-h-[88vh] h-[640px] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 text-white px-5 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/40 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-emerald-800"></span>
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Consultoria NeoLife</h3>
                <p className="text-[11px] text-emerald-100 flex items-center">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 mr-1.5"></span>
                  Mentoria & Educação Nutricional
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => {
                  setMessages([
                    {
                      id: 'welcome-reset',
                      role: 'assistant',
                      content:
                        'Conversa reiniciada. Em que posso ser útil neste momento?',
                      time: 'Agora',
                    },
                  ]);
                }}
                title="Limpar conversa"
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fechar chat"
                className="p-1.5 text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.role === 'assistant' ? renderFormattedMessage(m.content) : m.content}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{m.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 w-fit shadow-sm">
                <span className="text-xs text-gray-500 font-medium">A analisar resposta</span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (visible if only initial welcome) */}
          {messages.length <= 2 && (
            <div className="p-3 bg-white border-t border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Perguntas Frequentes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 py-1 px-2.5 rounded-full transition-colors border border-emerald-100/80"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escreva a sua dúvida aqui..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                aria-label="Enviar mensagem"
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <div className="mt-2 text-center">
              <span className="text-[10px] text-gray-400">
                Atendimento consultivo educacional - Não substitui conselho médico
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
