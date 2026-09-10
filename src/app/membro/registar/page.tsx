'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { countries } from '@/data/countries';

export default function MembroRegistarPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 2-step form

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    dialCode: '',
  });

  const availableCountries = countries.filter(c => c.available);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = availableCountries.find(c => c.id === e.target.value);
    setForm(f => ({
      ...f,
      country: e.target.value,
      dialCode: selected?.dialCode || '',
    }));
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }
    if (form.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const selectedCountry = availableCountries.find(c => c.id === form.country);
      const countryName = selectedCountry?.name || form.country;
      const phone = form.dialCode ? `${form.dialCode}${form.phone}` : form.phone;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone,
          country: countryName,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Erro ao criar conta.');
        return;
      }

      router.push('/membro/dashboard');
    } catch {
      setError('Erro de conexao. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
    color: '#f9fafb', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#d1d5db', fontSize: '13px',
    fontWeight: 500, marginBottom: '8px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 40%, #0a1628 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: "'Inter', -apple-system, sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '460px', position: 'relative', zIndex: 1 }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
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
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Criar Conta de Membro</p>
        </div>

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: step >= s ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.05)',
                border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: step >= s ? 'white' : '#6b7280', fontSize: '13px', fontWeight: 600,
                transition: 'all 0.3s',
              }}>
                {step > s ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : s}
              </div>
              {s < 2 && (
                <div style={{
                  width: '60px', height: '2px',
                  background: step > s ? 'linear-gradient(90deg, #10b981, #059669)' : 'rgba(255,255,255,0.08)',
                  borderRadius: '1px', transition: 'all 0.3s',
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px', padding: '40px', backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <h1 style={{
            color: '#f9fafb', fontSize: '20px', fontWeight: 700,
            margin: '0 0 4px', textAlign: 'center',
          }}>
            {step === 1 ? 'Dados de Acesso' : 'Informacao Pessoal'}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: '0 0 28px' }}>
            {step === 1 ? 'Passo 1 de 2' : 'Passo 2 de 2'}
          </p>

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

          {step === 1 ? (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  id="reg-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="o-seu-email@exemplo.com"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Senha</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    placeholder="Minimo 6 caracteres"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280',
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

              <div>
                <label style={labelStyle}>Confirmar Senha</label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                  placeholder="Repita a senha"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>

              <button
                id="reg-step1-btn"
                type="submit"
                style={{
                  width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                  marginTop: '8px', transition: 'transform 0.1s',
                  boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome completo</label>
                <input
                  id="reg-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="O seu nome completo"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>

              <div>
                <label style={labelStyle}>Pais de residencia</label>
                <select
                  id="reg-country"
                  value={form.country}
                  onChange={handleCountryChange}
                  required
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px',
                    cursor: 'pointer',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <option value="" style={{ background: '#1a1a2e' }}>Selecionar pais...</option>
                  {availableCountries.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Telefone</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {form.dialCode && (
                    <div style={{
                      padding: '12px 14px', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                      color: '#9ca3af', fontSize: '14px', whiteSpace: 'nowrap',
                    }}>
                      {form.dialCode}
                    </div>
                  )}
                  <input
                    id="reg-phone"
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                    placeholder="Numero de telefone"
                    style={{ ...inputStyle, flex: 1 }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  style={{
                    flex: 1, padding: '14px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)', background: 'transparent',
                    color: '#9ca3af', fontSize: '15px', fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  Voltar
                </button>
                <button
                  id="reg-submit-btn"
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2, padding: '14px', borderRadius: '10px', border: 'none',
                    background: loading
                      ? 'rgba(16,185,129,0.4)'
                      : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', fontSize: '15px', fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'transform 0.1s',
                    boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {loading ? 'A criar conta...' : 'Criar Conta'}
                </button>
              </div>
            </form>
          )}

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
              Ja tem conta?{' '}
              <Link href="/membro/login" style={{ color: '#10b981', textDecoration: 'none', fontWeight: 500 }}>
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
