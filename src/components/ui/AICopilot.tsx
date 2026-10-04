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
  'Como ganhar renda extra?',
  'Que produtos estão disponíveis?',
  'Como funciona o plano de compensação?',
  'Quanto custa para começar?',
];

const QUICK_PROMPTS_EN = [
  'How to earn extra income?',
  'What products are available?',
  'How does the compensation plan work?',
  'How much to start?',
];

export function AICopilot() {
  const { language } = useLanguage();
  const [copilotLanguage, setCopilotLanguage] = useState<'pt' | 'en'>(language === 'pt' ? 'pt' : 'en');
  const isPt = copilotLanguage === 'pt';
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const quickPrompts = isPt ? QUICK_PROMPTS_PT : QUICK_PROMPTS_EN;

  const [messages, setMessages] = useState<Message[]>([]);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [showIdentifyForm, setShowIdentifyForm] = useState(false);
  const [isIdentified, setIsIdentified] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isSubmittingIdentity, setIsSubmittingIdentity] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Typing effect for title
  const fullTitle = 'AI Copilot';
  useEffect(() => {
    if (typingIndex < fullTitle.length) {
      const timeout = setTimeout(() => {
        setTypingText(fullTitle.slice(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex]);

  // Repeat typing effect every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingText('');
      setTypingIndex(0);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Reset typing when copilot opens
  useEffect(() => {
    if (isOpen) {
      setTypingText('');
      setTypingIndex(0);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle voice input using Web Speech API
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(isPt ? 'Seu navegador não suporta reconhecimento de voz.' : 'Your browser does not support voice recognition.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = isPt ? 'pt-PT' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Remove markdown formatting and format lists for clean text display
  const cleanMarkdown = (text: string): string => {
    let processed = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/__(.*?)__/g, '$1') // Remove underline
      .replace(/~~(.*?)~~/g, '$1') // Remove strikethrough
      .replace(/\[(.*?)\]\(.*?\)/g, '$1'); // Remove links, keep text

    // Detect and format numbered lists
    // Pattern: "1. item" or "1) item" or "- item" or "* item"
    const lines = processed.split('\n');
    const formattedLines = lines.map((line: string) => {
      const trimmed = line.trim();
      // Check if line starts with a number pattern
      const numberedMatch = trimmed.match(/^(\d+)[\.\)]\s+(.+)/);
      if (numberedMatch) {
        return `${numberedMatch[1]}. ${numberedMatch[2]}`;
      }
      // Check if line starts with bullet point
      const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
      if (bulletMatch) {
        return `• ${bulletMatch[1]}`;
      }
      return trimmed;
    });

    // Join lines with proper spacing, preserve list structure
    let result = formattedLines.join('\n');
    // Replace multiple newlines with single newline
    result = result.replace(/\n{3,}/g, '\n\n');
    // Replace other newlines with spaces for non-list content
    result = result.replace(/([^\n•\d])\n(?![•\d])/g, '$1 ');

    return result.trim();
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, isMinimized, messages]);

  const handleIdentitySubmit = async () => {
    setIsSubmittingIdentity(true);
    try {
      // Save user data to leads API
      if (userData.name || userData.email) {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            phone: '',
            country: '',
            theme: 'ai-copilot-identity',
            source: 'ai-copilot',
          }),
        });
      }
      setIsIdentified(true);
      setShowIdentifyForm(false);
      
      // Add welcome message with user's name
      const welcomeMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: isPt
          ? userData.name
            ? `Olá, ${userData.name}! Somos Ofélia e José Machado, os seus consultores NeoLife. Como podemos ajudar?`
            : 'Olá! Somos Ofélia e José Machado, os seus consultores NeoLife. Como podemos ajudar?'
          : userData.name
          ? `Hello, ${userData.name}! We are Ofélia and José Machado, your NeoLife consultants. How can we help?`
          : 'Hello! We are Ofélia and José Machado, your NeoLife consultants. How can we help?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, welcomeMessage]);
    } catch (error) {
      console.error('Error saving identity:', error);
      setIsIdentified(true);
      setShowIdentifyForm(false);
    } finally {
      setIsSubmittingIdentity(false);
    }
  };

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
          language: copilotLanguage,
        }),
      });

      if (!res.ok) throw new Error('Error');

      const data = await res.json();
      // Personalize response if user provided name
      let responseContent = data.content || (isPt ? 'Desculpe, ocorreu um erro.' : 'Sorry, an error occurred.');
      if (userData.name && isPt) {
        responseContent = `${userData.name}, ${responseContent.toLowerCase()}`;
      } else if (userData.name && !isPt) {
        responseContent = `${userData.name}, ${responseContent.charAt(0).toLowerCase() + responseContent.slice(1)}`;
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...newMessages, assistantMessage]);

      // Show identity form after first response if not yet identified
      if (!isIdentified && messages.length === 0) {
        setShowIdentifyForm(true);
      }
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
        {/* Pulse ring effect */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '50px',
            border: '2px solid #10b981',
            animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            opacity: 0.5,
          }}
        />
        <style>{`
          @keyframes pulse-ring {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.5;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.3);
              opacity: 0;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0;
            }
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}</style>
        <div
          style={{
            background: 'white',
            borderRadius: '50px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            color: '#10b981',
            fontSize: '11px',
            fontWeight: 600,
            transition: 'all 0.3s',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 1,
          }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
        >
          {/* Wehosthere Mascot Icon */}
          <a
            href="https://www.wehosthere.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#eff6ff'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = '#f8fafc'}
          >
            <img
              src="/mascot-wehosthere.png"
              alt="Wehosthere Mascot"
              style={{
                width: '20px',
                height: '20px',
                objectFit: 'contain',
                borderRadius: '50%',
              }}
            />
          </a>

          {/* Text */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '-0.2px', color: '#10b981' }}>
              {typingText}
              <span style={{ opacity: typingIndex < fullTitle.length ? 1 : 0, animation: typingIndex < fullTitle.length ? 'blink 1s infinite' : 'none' }}>|</span>
            </div>
          </div>

          {/* Green dot */}
          <div
            style={{
              width: '6px',
              height: '6px',
              background: '#10b981',
              borderRadius: '50%',
              boxShadow: '0 0 8px #10b981',
            }}
          />

          {/* Close X button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            style={{
              background: '#f1f5f9',
              border: 'none',
              color: '#64748b',
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
              padding: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = '#e2e8f0'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = '#f1f5f9'}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
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
        bottom: '80px',
        width: '360px',
        maxWidth: 'calc(100vw - 40px)',
        zIndex: 1000,
        fontFamily: 'Inter, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
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
          <a
            href="https://www.wehosthere.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '32px',
              height: '32px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'}
          >
            <img
              src="/mascot-wehosthere.png"
              alt="Wehosthere Mascot"
              style={{
                width: '26px',
                height: '26px',
                objectFit: 'contain',
                borderRadius: '50%',
              }}
            />
          </a>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px', color: 'white' }}>
              NeoLife {typingText}
              <span style={{ opacity: typingIndex < fullTitle.length ? 1 : 0, animation: typingIndex < fullTitle.length ? 'blink 1s infinite' : 'none' }}>|</span>
            </div>
            <div style={{ fontSize: '10px', opacity: 0.85, fontWeight: 400 }}>
              Ofélia & José Machado
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Language Selector */}
          <button
            onClick={() => setCopilotLanguage(isPt ? 'en' : 'pt')}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 600,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'}
          >
            {isPt ? '🇵🇹 PT' : '🇬🇧 EN'}
          </button>
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
              width: '24px',
              height: '24px',
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Messages */}
          <div
            style={{
              flex: 1,
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
                    lineHeight: 1.6,
                    wordBreak: 'break-word',
                    background: m.role === 'user' ? 'linear-gradient(135deg, #10b981, #059669)' : 'white',
                    color: m.role === 'user' ? 'white' : '#1e293b',
                    boxShadow: m.role === 'user' ? '0 2px 8px rgba(16, 185, 129, 0.25)' : '0 1px 3px rgba(0,0,0,0.08)',
                    whiteSpace: 'pre-wrap',
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
                        background: '#10b981',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#10b981',
                        borderRadius: '50%',
                        animation: 'bounce 1.4s infinite ease-in-out 0.2s',
                      }}
                    />
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#10b981',
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
          {showQuickPrompts && (
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
                      (e.currentTarget as HTMLElement).style.borderColor = '#10b981';
                      (e.currentTarget as HTMLElement).style.color = '#059669';
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
              <button
                type="button"
                onClick={() => setShowQuickPrompts(!showQuickPrompts)}
                style={{
                  background: showQuickPrompts ? '#10b981' : '#f1f5f9',
                  border: 'none',
                  color: showQuickPrompts ? 'white' : '#64748b',
                  width: '36px',
                  height: '36px',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                title={isPt ? 'Mostrar opções rápidas' : 'Show quick options'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </button>
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
                  (e.currentTarget as HTMLElement).style.borderColor = '#10b981';
                  (e.currentTarget as HTMLElement).style.background = 'white';
                }}
                onBlur={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                  (e.currentTarget as HTMLElement).style.background = '#f8fafc';
                }}
              />
              <button
                type="button"
                onClick={startListening}
                disabled={isListening}
                style={{
                  background: isListening ? '#ef4444' : '#f1f5f9',
                  border: 'none',
                  color: isListening ? 'white' : '#64748b',
                  width: '36px',
                  height: '36px',
                  borderRadius: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                title={isPt ? 'Usar voz' : 'Use voice'}
              >
                {isListening ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 1a3 3 0 0 0-3 3v10a3 3 0 0 0 6 0 3 3 0 0 0 3-3V4a3 3 0 0 0-3-3" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                )}
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                style={{
                  padding: '10px 16px',
                  borderRadius: '18px',
                  border: 'none',
                  background: input.trim() ? 'linear-gradient(135deg, #10b981, #059669)' : '#cbd5e1',
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

          {/* Identity Form (optional, appears on first message) */}
          {showIdentifyForm && !isIdentified && (
            <div style={{ padding: '14px 18px', background: '#f0fdf4', borderTop: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#059669', marginBottom: '10px' }}>
                {isPt ? 'Como gostaria de ser chamado?' : 'How would you like to be called?'}
                <span style={{ fontSize: '10px', fontWeight: 400, color: '#64748b', marginLeft: '8px' }}>
                  ({isPt ? 'Opcional' : 'Optional'})
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input
                  type="text"
                  placeholder={isPt ? 'Seu nome' : 'Your name'}
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0',
                    fontSize: '12px',
                    outline: 'none',
                    background: 'white',
                  }}
                />
                <input
                  type="email"
                  placeholder={isPt ? 'Seu email (opcional)' : 'Your email (optional)'}
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0',
                    fontSize: '12px',
                    outline: 'none',
                    background: 'white',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleIdentitySubmit}
                    disabled={isSubmittingIdentity}
                    style={{
                      flex: 1,
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: isSubmittingIdentity ? 'not-allowed' : 'pointer',
                      opacity: isSubmittingIdentity ? 0.7 : 1,
                    }}
                  >
                    {isSubmittingIdentity ? (isPt ? 'A guardar...' : 'Saving...') : (isPt ? 'Continuar' : 'Continue')}
                  </button>
                  <button
                    onClick={() => {
                      setShowIdentifyForm(false);
                      setIsIdentified(true);
                      const welcomeMessage: Message = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: isPt
                          ? 'Olá! Somos Ofélia e José Machado, os seus consultores NeoLife. Como podemos ajudar?'
                          : 'Hello! We are Ofélia and José Machado, your NeoLife consultants. How can we help?',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      };
                      setMessages(prev => [...prev, welcomeMessage]);
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      border: '1px solid #bbf7d0',
                      background: 'white',
                      color: '#64748b',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {isPt ? 'Ignorar' : 'Skip'}
                  </button>
                </div>
              </div>
            </div>
          )}

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
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#10b981'}
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
