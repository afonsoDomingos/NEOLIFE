'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { countries } from '@/data/countries';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  plan: string;
}

export default function MembroPerfilPage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    country: '',
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const availableCountries = countries.filter(c => c.available);

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/membro/login');
        return;
      }
      const data = await res.json();
      setMember(data);
      setForm({ name: data.name, phone: data.phone, country: data.country });
    } catch {
      router.push('/membro/login');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error });
      } else {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso.' });
        setMember(prev => prev ? { ...prev, ...form } : null);
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMessage({ type: 'error', text: 'As senhas nao coincidem.' });
      return;
    }
    setSavingPw(true);
    setPwMessage(null);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMessage({ type: 'error', text: data.error });
      } else {
        setPwMessage({ type: 'success', text: 'Senha alterada com sucesso.' });
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch {
      setPwMessage({ type: 'error', text: 'Erro ao alterar senha.' });
    } finally {
      setSavingPw(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/membro/login');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)',
    color: '#f9fafb', fontSize: '14px', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', color: '#9ca3af', fontSize: '13px',
    fontWeight: 500, marginBottom: '8px',
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #0d1117 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid rgba(16,185,129,0.2)', borderTopColor: '#10b981',
            margin: '0 auto 16px', animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>A carregar...</p>
        </div>
      </div>
    );
  }

  if (!member) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0a0a0f 0%, #0d1117 50%, #080d1a 100%)',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Top Nav */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto', padding: '0 24px',
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{
              fontSize: '18px', fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981, #6ee7b7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>NeoLife</span>
          </Link>
          <nav style={{ display: 'flex', gap: '4px' }}>
            <Link href="/membro/dashboard" style={{
              padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '14px', color: '#9ca3af', transition: 'color 0.2s',
            }}>Dashboard</Link>
            <Link href="/membro/perfil" style={{
              padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
              fontSize: '14px', fontWeight: 600, color: '#10b981',
              background: 'rgba(16,185,129,0.1)',
            }}>Perfil</Link>
          </nav>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
              color: '#9ca3af', fontSize: '13px', cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Back link */}
        <Link href="/membro/dashboard" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: '#6b7280', fontSize: '13px', textDecoration: 'none', marginBottom: '32px',
          transition: 'color 0.2s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#9ca3af'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6b7280'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Voltar ao Dashboard
        </Link>

        <h1 style={{ color: '#f9fafb', fontSize: '24px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.3px' }}>
          O Meu Perfil
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 40px' }}>
          Gerir as suas informacoes pessoais e senha de acesso
        </p>

        {/* Profile form */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '32px', marginBottom: '24px',
        }}>
          <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: 600, margin: '0 0 24px' }}>
            Informacao Pessoal
          </h2>

          {message && (
            <div style={{
              background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: message.type === 'success' ? '#6ee7b7' : '#fca5a5', fontSize: '14px',
            }}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nome completo</label>
                <input
                  id="profile-name"
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={member.email}
                  disabled
                  style={{ ...inputStyle, opacity: 0.4, cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Telefone</label>
                <input
                  id="profile-phone"
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Pais</label>
                <select
                  id="profile-country"
                  value={availableCountries.find(c => c.name === form.country)?.id || ''}
                  onChange={e => {
                    const c = availableCountries.find(x => x.id === e.target.value);
                    setForm(f => ({ ...f, country: c?.name || e.target.value }));
                  }}
                  style={{
                    ...inputStyle,
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px', cursor: 'pointer',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  <option value="" style={{ background: '#1a1a2e' }}>Selecionar...</option>
                  {availableCountries.map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#1a1a2e' }}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                id="save-profile-btn"
                type="submit"
                disabled={saving}
                style={{
                  padding: '12px 28px', borderRadius: '10px', border: 'none',
                  background: saving ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', fontSize: '14px', fontWeight: 600,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(16,185,129,0.25)', transition: 'transform 0.1s',
                }}
                onMouseEnter={e => { if (!saving) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {saving ? 'A guardar...' : 'Guardar alteracoes'}
              </button>
            </div>
          </form>
        </div>

        {/* Password form */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '32px',
        }}>
          <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
            Alterar Senha
          </h2>
          <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 24px' }}>
            Deve ter pelo menos 6 caracteres
          </p>

          {pwMessage && (
            <div style={{
              background: pwMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${pwMessage.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              borderRadius: '10px', padding: '12px 16px', marginBottom: '20px',
              color: pwMessage.type === 'success' ? '#6ee7b7' : '#fca5a5', fontSize: '14px',
            }}>
              {pwMessage.text}
            </div>
          )}

          <form onSubmit={handleSavePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Senha atual</label>
              <input
                id="current-password"
                type="password"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                required
                placeholder="A sua senha atual"
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Nova senha</label>
                <input
                  id="new-password"
                  type="password"
                  value={pwForm.newPassword}
                  onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  required
                  placeholder="Nova senha"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirmar nova senha</label>
                <input
                  id="confirm-new-password"
                  type="password"
                  value={pwForm.confirmPassword}
                  onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  required
                  placeholder="Repetir nova senha"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                id="save-password-btn"
                type="submit"
                disabled={savingPw}
                style={{
                  padding: '12px 28px', borderRadius: '10px', border: 'none',
                  background: savingPw ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: 'white', fontSize: '14px', fontWeight: 600,
                  cursor: savingPw ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 15px rgba(99,102,241,0.25)', transition: 'transform 0.1s',
                }}
                onMouseEnter={e => { if (!savingPw) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {savingPw ? 'A alterar...' : 'Alterar Senha'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
