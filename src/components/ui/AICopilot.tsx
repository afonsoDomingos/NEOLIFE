'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

const QUICK_PROMPTS_PT = [
  'Que produtos estão disponíveis?',
  'Qual o melhor pack para energia?',
  'Como funciona a mentoria?',
  'Como posso encomendar?',
];

const QUICK_PROMPTS_EN = [
  'What products are available?',
  'Which pack is best for energy?',
  'How does the mentorship work?',
  'How can I order?',
];

export function AICopilot() {
  const { language } = useLanguage();
  const isPt = language === 'pt';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const quickPrompts = isPt ? QUICK_PROMPTS_PT : QUICK_PROMPTS_EN;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: isPt
        ? 'Olá! Sou o AI Copilot da NeoLife. Conheço todos os nossos produtos de saúde, packs e oportunidades de negócio. Como posso ajudar?'
        : 'Hello! I am the NeoLife AI Copilot. I know all our health products, packs, and business opportunities. How can I help?',
      time: isPt ? 'Agora' : 'Now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Remove markdown formatting for clean text display
  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/__(.*?)__/g, '$1') // Remove underline
      .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
      .replace(/\n/g, ' '); // Replace newlines with spaces
      .trim();
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, isMinimized, messages]);

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

      if (!res.ok) throw new Error('Error');

      const data = await res.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || (isPt ? 'Desculpe, ocorreu um erro.' : 'Sorry, an error occurred.'),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isPt
          ? 'Desculpe, não consegui conectar ao serviço. Tente novamente.'
          : 'Sorry, could not connect to the service. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Minimized banner (inspired by the image)
  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '120px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
            borderRadius: '50px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 6px 24px rgba(59, 130, 246, 0.3)',
            color: 'white',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'all 0.3s',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 32px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.3)';
          }}
        >
          {/* AI Icon */}
          <div
            style={{
              width: '24px',
              height: '24px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>

          {/* Text */}
          <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '-0.2px' }}>
            AI Copilot
          </div>

          {/* Green dot */}
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 10px #10b981',
            }}
          />

          {/* Close X button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Open chat window (inspired by the image)
  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        right: '20px',
        width: '360px',
        maxWidth: 'calc(100vw - 40px)',
        zIndex: 1000,
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
          borderRadius: '20px 20px 0 0',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          boxShadow: '0 4px 24px rgba(59, 130, 246, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px' }}>
              NeoLife AI Copilot
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {isMinimized ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </svg>
          </button>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat content */}
      {!isMinimized && (
        <div
          style={{
            background: 'white',
            borderRadius: '0 0 20px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.15)',
            borderTop: 'none',
          }}
        >
          {/* Messages */}
          <div
            style={{
              height: '380px',
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#f8fafc',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: '18px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                    background: m.role === 'user' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'white',
                    color: m.role === 'user' ? 'white' : '#1e293b',
                    boxShadow: m.role === 'user' ? '0 2px 8px rgba(59, 130, 246, 0.25)' : '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  {m.role === 'assistant' ? cleanMarkdown(m.content) : m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '18px',
                    background: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out 0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#3b82f6',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out 0.4s',
                      }}
                    />
                  </div>
                  <style>{`
                    @keyframes bounce {
                      0%, 80%, 100% { transform: scale(0); }
                      40% { transform: scale(1); }
                    }
                  `}</style>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Services/Quick prompts (like the image) */}
          {messages.length <= 2 && (
            <div style={{ padding: '14px 18px', background: 'white', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '10px', letterSpacing: '0.5px' }}>
                {isPt ? 'POSSO AJUDAR COM:' : 'I CAN HELP WITH:'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '18px',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      color: '#334155',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                      (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6';
                      (e.currentTarget as HTMLElement).style.color = '#1e40af';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                      (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                      (e.currentTarget as HTMLElement).style.color = '#334155';
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '14px 18px', background: 'white', borderTop: '1px solid #e5e7eb' }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{ display: 'flex', gap: '8px' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isPt ? 'Digite sua pergunta...' : 'Type your question...'}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: '#f8fafc',
                }}
                onFocus={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6';
                  (e.currentTarget as HTMLElement).style.background = 'white';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '10px 16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: input.trim() ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#cbd5e1',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: input.trim() ? '0 2px 8px rgba(59, 130, 246, 0.3)' : 'none',
                }}
              >
                {isPt ? 'Enviar' : 'Send'}
              </button>
            </form>
          </div>

          {/* Powered by Wehosthere footer */}
          <div
            style={{
              padding: '10px 18px',
              background: '#f8fafc',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <img
              src="/logo-wehosthere.png"
              alt="Wehosthere"
              style={{
                height: '16px',
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <a
              href="https://www.wehosthere.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '10px',
                color: '#64748b',
                textDecoration: 'none',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#3b82f6'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#64748b'}
            >
              Powered by Wehosthere
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
