'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MembroLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao fazer login.');
        return;
      }

      router.push('/membro/dashboard');
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #0a1628 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              marginBottom: '12px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px rgba(16,185,129,0.3)',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="white" opacity="0.2"/>
                  <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{
                fontSize: '24px', fontWeight: 700,
                background: 'linear-gradient(135deg, #10b981, #6ee7b7)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}>NeoLife</span>
            </div>
          </Link>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Area de Membros</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{
            color: '#f9fafb', fontSize: '22px', fontWeight: 700,
            margin: '0 0 8px', textAlign: 'center',
          }}>Bem-vindo de volta</h1>
          <p style={{
            color: '#9ca3af', fontSize: '14px', textAlign: 'center', margin: '0 0 32px',
          }}>Aceda a sua area exclusiva</p>

          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: '#fca5a5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#fca5a5" strokeWidth="2"/>
                <line x1="12" y1="8" x2="12" y2="12" stroke="#fca5a5" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#fca5a5"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                Email
              </label>
              <input
                id="member-login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="o-seu-email@exemplo.com"
                style={{
                  width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.05)', color: '#f9fafb', fontSize: '14px',
                  outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#d1d5db', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="member-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="A sua senha"
                  style={{
                    width: '100%', padding: '12px 44px 12px 16px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
                    color: '#f9fafb', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#6b7280',
                  }}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              id="member-login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                background: loading
                  ? 'rgba(16,185,129,0.4)'
                  : 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', fontSize: '15px', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px', transition: 'opacity 0.2s, transform 0.1s',
                boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading ? (
                'A entrar...'
              ) : (
                <>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
              Nao tem conta?{' '}
              <Link href="/membro/registar" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link href="/" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>
            Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  );
}
