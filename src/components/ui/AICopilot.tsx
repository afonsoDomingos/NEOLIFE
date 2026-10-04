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
        ? 'Olá! Sou o **AI Copilot** da NeoLife. Conheço todos os nossos produtos de saúde, packs e oportunidades de negócio. Como posso ajudar?'
        : 'Hello! I am the NeoLife **AI Copilot**. I know all our health products, packs, and business opportunities. How can I help?',
      time: isPt ? 'Agora' : 'Now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Minimized banner (like the image)
  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '120px',
          right: '20px',
          zIndex: 1000,
          cursor: 'pointer',
        }}
        onClick={() => setIsOpen(true)}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
            color: 'white',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(59, 130, 246, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.4)';
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '24px',
              height: '24px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>

          {/* Text */}
          <span>AI Copilot</span>

          {/* Green dot */}
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 8px #10b981',
            }}
          />

          {/* Mic icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
      </div>
    );
  }

  // Open chat window
  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        right: '20px',
        width: '380px',
        maxWidth: 'calc(100vw - 40px)',
        zIndex: 1000,
        fontFamily: 'Inter, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          borderRadius: '12px 12px 0 0',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>AI Copilot</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>
              {isPt ? 'NeoLife Assistant' : 'NeoLife Assistant'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Minimize button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'}
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
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'}
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
            borderRadius: '0 0 12px 12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderTop: 'none',
          }}
        >
          {/* Messages */}
          <div
            style={{
              height: '400px',
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#f9fafb',
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
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    wordBreak: 'break-word',
                    background: m.role === 'user' ? '#3b82f6' : 'white',
                    color: m.role === 'user' ? 'white' : '#1f2937',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'white',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
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

          {/* Quick prompts */}
          {messages.length <= 2 && (
            <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase' }}>
                {isPt ? 'Perguntas Frequentes' : 'Frequently Asked'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '16px',
                      border: '1px solid #e5e7eb',
                      background: '#f9fafb',
                      color: '#374151',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                      (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6';
                      (e.currentTarget as HTMLElement).style.color = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#f9fafb';
                      (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                      (e.currentTarget as HTMLElement).style.color = '#374151';
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', background: 'white', borderTop: '1px solid #e5e7eb' }}>
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
                placeholder={isPt ? 'Pergunte sobre produtos...' : 'Ask about products...'}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6'}
                onBlur={(e) => (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb'}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: input.trim() ? '#3b82f6' : '#9ca3af',
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: input.trim() ? 'pointer' : 'not-allowed',
                  transition: 'background 0.2s',
                }}
              >
                {isPt ? 'Enviar' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
