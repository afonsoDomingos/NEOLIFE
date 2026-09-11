'use client';

import React, { useState, useRef, useEffect } from 'react';

interface AdminAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface AdminAIAssistantProps {
  leadContext?: {
    name?: string;
    interest?: string;
    country?: string;
    status?: string;
  };
  onCopyText?: (text: string) => void;
}

const ADMIN_QUICK_PROMPTS = [
  'Como responder a um lead interessado em nutrição?',
  'Sugerir mensagem de boas-vindas para novo parceiro',
  'Como apresentar a oportunidade de negócio?',
  'Resposta para lead que quer saber preços',
  'Como fazer o seguimento de um lead frio?',
];

export function AdminAIAssistant({ leadContext, onCopyText }: AdminAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [messages, setMessages] = useState<AdminAIMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: leadContext?.name
        ? `Olá! Estou pronto para ajudar com o lead **${leadContext.name}**${leadContext.country ? ` (${leadContext.country})` : ''}${leadContext.interest ? ` — interesse em ${leadContext.interest}` : ''}.\n\nPosso sugerir mensagens, estratégias de abordagem ou responder dúvidas sobre como avançar com este contacto. O que precisa?`
        : 'Olá! Sou o seu assistente de IA para ajudar na gestão de leads e parceiros NeoLife.\n\nPosso sugerir mensagens personalizadas, estratégias de abordagem, respostas a dúvidas frequentes e muito mais. Como posso ajudar?',
      time: 'Agora',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMessage: AdminAIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    const adminSystemContext = leadContext?.name
      ? `[Contexto do lead: Nome: ${leadContext.name}, País: ${leadContext.country || 'N/A'}, Interesse: ${leadContext.interest || 'N/A'}, Estado: ${leadContext.status || 'N/A'}] `
      : '';

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.id === 'welcome' ? m.content : m.role === 'user' && m.id === userMessage.id ? adminSystemContext + text : m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error('Falha');

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply || 'Peço desculpa, ocorreu um problema. Tente novamente.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Erro na ligação à IA. Verifique a sua ligação e tente novamente.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    });
    setCopied(id);
    onCopyText?.(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderMessage = (content: string) =>
    content.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className={i > 0 ? 'mt-1' : ''}>
          {parts.map((part, j) =>
            part.startsWith('**') && part.endsWith('**') ? (
              <strong key={j} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    });

  return (
    <>
      {!isOpen && (
        <button
          id="admin-ai-assistant-btn"
          onClick={() => setIsOpen(true)}
          title="Abrir Assistente de IA"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 text-sm font-semibold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Assistente IA
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[420px] h-[620px] max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-700 to-indigo-600 text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">Assistente IA NeoLife</p>
                <p className="text-[11px] text-violet-200">
                  {leadContext?.name ? `Lead: ${leadContext.name}` : 'Painel Admin'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                id="admin-ai-clear-btn"
                onClick={() =>
                  setMessages([{
                    id: 'reset',
                    role: 'assistant',
                    content: 'Conversa reiniciada. Como posso ajudar?',
                    time: 'Agora',
                  }])
                }
                title="Limpar conversa"
                className="p-1.5 text-violet-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                id="admin-ai-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar assistente IA"
                className="p-1.5 text-violet-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {m.role === 'assistant' ? renderMessage(m.content) : m.content}
                </div>

                {m.role === 'assistant' && m.id !== 'welcome' && m.id !== 'reset' && (
                  <button
                    onClick={() => handleCopy(m.content, m.id)}
                    title="Copiar resposta"
                    className={`mt-1.5 flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full transition-all ${
                      copied === m.id
                        ? 'text-green-700 bg-green-50 border border-green-200'
                        : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent'
                    }`}
                  >
                    {copied === m.id ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiado!
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copiar texto
                      </>
                    )}
                  </button>
                )}

                <span className="text-[10px] text-gray-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 bg-white border border-gray-100 rounded-2xl rounded-bl-none px-4 py-3 w-fit shadow-sm">
                <span className="text-xs text-gray-500">A gerar resposta</span>
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-white border-t border-gray-100">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Sugestões rápidas
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ADMIN_QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-800 py-1 px-2.5 rounded-full transition-colors border border-indigo-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input
                ref={inputRef}
                id="admin-ai-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Peça uma sugestão de resposta, estratégia..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
              <button
                type="submit"
                id="admin-ai-send-btn"
                disabled={!input.trim() || isLoading}
                aria-label="Enviar para IA"
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">
              IA de apoio à gestão — respostas podem precisar de revisão
            </p>
          </div>
        </div>
      )}
    </>
  );
}
