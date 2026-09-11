'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  plan: string;
  referralCode: string;
  createdAt: string;
  lastLoginAt: string;
}

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
        background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: `${color}20`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', marginBottom: '16px', color,
      }}>
        {icon}
      </div>
      <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 4px', fontWeight: 500 }}>{label}</p>
      <p style={{ color: '#f9fafb', fontSize: '22px', fontWeight: 700, margin: '0 0 2px' }}>{value}</p>
      {sub && <p style={{ color: '#4b5563', fontSize: '12px', margin: 0 }}>{sub}</p>}
    </div>
  );
}

function QuickLink({ icon, label, description, href, color }: {
  icon: React.ReactNode; label: string; description: string; href: string; color: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
          border: `1px solid ${hovered ? color + '40' : 'rgba(255,255,255,0.07)'}`,
          borderRadius: '14px', padding: '20px', cursor: 'pointer',
          transition: 'all 0.25s', transform: hovered ? 'translateY(-2px)' : 'none',
        }}
      >
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px',
          background: `${color}20`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: '14px', color,
          transition: 'background 0.2s',
        }}>
          {icon}
        </div>
        <p style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>{label}</p>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, lineHeight: 1.5 }}>{description}</p>
      </div>
    </Link>
  );
}

export default function MembroDashboard() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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
    } catch {
      router.push('/membro/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      window.location.href = '/membro/login';
    }
  };

  const copyReferral = () => {
    if (!member) return;
    const link = `${window.location.origin}/membro/registar?ref=${member.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getMemberSince = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
  };

  const getFirstName = (name: string) => name.split(' ')[0];

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
            border: '3px solid rgba(16,185,129,0.2)',
            borderTopColor: '#10b981',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>A carregar...</p>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const navLinks = [
    { label: 'Dashboard', href: '/membro/dashboard', active: true },
    { label: 'Perfil', href: '/membro/perfil', active: false },
  ];

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
          maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
          height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
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

          {/* Desktop nav */}
          <nav style={{ display: 'flex', gap: '4px' }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px',
                fontWeight: link.active ? 600 : 400,
                color: link.active ? '#10b981' : '#9ca3af',
                background: link.active ? 'rgba(16,185,129,0.1)' : 'transparent',
                transition: 'all 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '6px 14px 6px 6px', borderRadius: '100px',
              border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)',
            }}>
              <div style={{
                width: '30px', height: '30px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '13px', fontWeight: 700,
              }}>
                {member.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 500 }}>
                {getFirstName(member.name)}
              </span>
            </div>
            <button
              id="member-logout-btn"
              onClick={handleLogout}
              style={{
                padding: '8px 14px', borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)', background: 'transparent',
                color: '#9ca3af', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#f9fafb'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{
            color: '#f9fafb', fontSize: '28px', fontWeight: 700, margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}>
            Ola, {getFirstName(member.name)}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
            Membro desde {getMemberSince(member.createdAt)} - Bem-vindo a sua area exclusiva NeoLife
          </p>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '40px',
        }}>
          <StatCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
            label="Estado da Conta"
            value="Ativo"
            sub="Membro verificado"
            color="#10b981"
          />
          <StatCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>}
            label="Plano Atual"
            value={member.plan || 'Base'}
            sub={member.country}
            color="#3b82f6"
          />
          <StatCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
            label="Referidos"
            value="0"
            sub="Convide amigos"
            color="#8b5cf6"
          />
          <StatCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            label="Ultimo Acesso"
            value="Hoje"
            sub={member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '-'}
            color="#f59e0b"
          />
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px', alignItems: 'start' }}>

          {/* Quick Links */}
          <div>
            <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>
              Acesso Rapido
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <QuickLink
                href="/membro/perfil"
                label="O Meu Perfil"
                description="Gerir dados pessoais e senha"
                color="#10b981"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
              />
              <QuickLink
                href="#recursos"
                label="Recursos"
                description="Materiais e ferramentas exclusivos"
                color="#3b82f6"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
              />
              <QuickLink
                href="#noticias"
                label="Noticias"
                description="Ultimas novidades da NeoLife"
                color="#8b5cf6"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>}
              />
              <QuickLink
                href="#suporte"
                label="Suporte"
                description="Fale com a equipa NeoLife"
                color="#f59e0b"
                icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
              />
            </div>

            {/* Coming Soon section */}
            <div style={{
              marginTop: '24px',
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px', padding: '28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  background: 'rgba(16,185,129,0.1)', borderRadius: '8px',
                  padding: '6px 12px', display: 'inline-block',
                }}>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>EM BREVE</span>
                </div>
              </div>
              <h3 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: 600, margin: '0 0 8px' }}>
                Conteudo Exclusivo a Chegar
              </h3>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
                Estamos a preparar materiais formativos, videos exclusivos e ferramentas para membros NeoLife. Fique atento!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Biblioteca de formacao', progress: 80 },
                  { label: 'Videos exclusivos', progress: 60 },
                  { label: 'Ferramentas de gestao', progress: 40 },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: '#9ca3af', fontSize: '13px' }}>{item.label}</span>
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>{item.progress}%</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${item.progress}%`,
                        background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '2px',
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Profile card */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '16px', padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '22px', fontWeight: 700, flexShrink: 0,
                }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ color: '#f9fafb', fontSize: '15px', fontWeight: 600, margin: '0 0 2px' }}>
                    {member.name}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>{member.email}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Pais', value: member.country },
                  { label: 'Telefone', value: member.phone },
                  { label: 'Plano', value: member.plan || 'Base' },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <span style={{ color: '#6b7280', fontSize: '13px' }}>{row.label}</span>
                    <span style={{ color: '#e5e7eb', fontSize: '13px', fontWeight: 500 }}>{row.value}</span>
                  </div>
                ))}
              </div>
              <Link href="/membro/perfil" style={{
                display: 'block', marginTop: '16px', padding: '10px', textAlign: 'center',
                borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)',
                color: '#10b981', fontSize: '13px', fontWeight: 500, textDecoration: 'none',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(16,185,129,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                Editar Perfil
              </Link>
            </div>

            {/* Referral card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.04))',
              border: '1px solid rgba(16,185,129,0.15)', borderRadius: '16px', padding: '24px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                  <polyline points="16 6 12 2 8 6"/>
                  <line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
                <h3 style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 600, margin: 0 }}>
                  Convidar Amigos
                </h3>
              </div>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 16px', lineHeight: 1.6 }}>
                Partilhe o seu link unico e convide pessoas a juntarem-se a NeoLife.
              </p>
              <div style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px 12px',
                fontFamily: 'monospace', fontSize: '12px', color: '#9ca3af',
                marginBottom: '12px', wordBreak: 'break-all',
              }}>
                neolife.com/ref/{member.referralCode}
              </div>
              <button
                id="copy-referral-btn"
                onClick={copyReferral}
                style={{
                  width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                  background: copied ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)',
                  color: '#10b981', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px',
                }}
              >
                {copied ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copiado!
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copiar Link
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
