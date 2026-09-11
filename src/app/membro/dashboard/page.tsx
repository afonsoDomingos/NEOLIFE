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

interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  createdAt: string;
}

interface LeadStatusData {
  status: 'novo' | 'contactado' | 'acompanhamento' | 'interessado' | 'convertido' | 'nao_interessado';
  notes?: string;
  theme?: string;
  country?: string;
  updatedAt?: string;
}

interface ResourceItem {
  _id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link' | 'guide';
  url: string;
  order: number;
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

const statusConfig: Record<string, { label: string; step: number; color: string; desc: string }> = {
  novo: {
    label: 'Candidatura Recebida',
    step: 1,
    color: '#3b82f6',
    desc: 'O teu pedido de contacto está registado e a ser avaliado pela liderança.',
  },
  contactado: {
    label: 'Em Primeiro Contacto',
    step: 2,
    color: '#eab308',
    desc: 'A nossa equipa já iniciou a apresentação dos primeiros passos.',
  },
  acompanhamento: {
    label: 'Em Acompanhamento Ativo',
    step: 3,
    color: '#a855f7',
    desc: 'Esclarecimento de dúvidas e alinhamento do teu plano de arranque.',
  },
  interessado: {
    label: 'Perfil Validado',
    step: 4,
    color: '#06b6d4',
    desc: 'Estás pronto para avançar para a fase de parceiro oficial.',
  },
  convertido: {
    label: 'Parceiro Oficial Ativo',
    step: 5,
    color: '#10b981',
    desc: 'Parabéns! Fazes parte da família de distribuidores e líderes NeoLife.',
  },
};

export default function MembroDashboard() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // New states connected to Admin
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([]);
  const [leadStatus, setLeadStatus] = useState<LeadStatusData | null>(null);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [resourceFilter, setResourceFilter] = useState<string>('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 1. Auth check
      const res = await fetch('/api/auth/me');
      if (!res.ok) {
        router.push('/membro/login');
        return;
      }
      const data = await res.json();
      setMember(data);

      // 2. Fetch admin announcements
      fetch('/api/member/announcements')
        .then(r => r.ok ? r.json() : [])
        .then(data => {
          if (Array.isArray(data)) setAnnouncements(data);
        })
        .catch(() => {});

      // 3. Fetch lead status & notes from admin CRM
      fetch('/api/member/lead-status')
        .then(r => r.ok ? r.json() : { lead: null })
        .then(data => {
          if (data?.lead) setLeadStatus(data.lead);
        })
        .catch(() => {});

      // 4. Fetch resources library
      fetch('/api/member/resources')
        .then(r => r.ok ? r.json() : [])
        .then(data => {
          if (Array.isArray(data)) setResources(data);
        })
        .catch(() => {});
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

  const dismissAnnouncement = (id: string) => {
    setDismissedAnnouncements(prev => [...prev, id]);
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
          <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>A carregar área de membro...</p>
        </div>
      </div>
    );
  }

  if (!member) return null;

  const navLinks = [
    { label: 'Dashboard', href: '/membro/dashboard', active: true },
    { label: 'Perfil', href: '/membro/perfil', active: false },
  ];

  const visibleAnnouncements = announcements.filter(a => !dismissedAnnouncements.includes(a._id));

  const filteredResources = resources.filter(item => {
    if (resourceFilter === 'all') return true;
    return item.type === resourceFilter;
  });

  const currentStatusInfo = leadStatus?.status && statusConfig[leadStatus.status]
    ? statusConfig[leadStatus.status]
    : {
        label: 'Membro Registado',
        step: 1,
        color: '#10b981',
        desc: 'A tua conta de membro está ativa e com acesso aos materiais.',
      };

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
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px 60px' }}>

        {/* 📣 1. ANÚNCIOS DO ADMIN (EM DESTAQUE NO TOPO) */}
        {visibleAnnouncements.length > 0 && (
          <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {visibleAnnouncements.map(ann => {
              const borderColors = {
                info: 'rgba(59, 130, 246, 0.4)',
                success: 'rgba(16, 185, 129, 0.4)',
                warning: 'rgba(245, 158, 11, 0.4)',
              };
              const bgColors = {
                info: 'linear-gradient(135deg, rgba(30, 58, 138, 0.25), rgba(15, 23, 42, 0.4))',
                success: 'linear-gradient(135deg, rgba(6, 78, 59, 0.25), rgba(15, 23, 42, 0.4))',
                warning: 'linear-gradient(135deg, rgba(120, 53, 15, 0.25), rgba(15, 23, 42, 0.4))',
              };
              const icons = { info: 'ℹ️', success: '🎉', warning: '⚠️' };
              const accentColor = ann.type === 'warning' ? '#f59e0b' : ann.type === 'success' ? '#10b981' : '#3b82f6';

              return (
                <div
                  key={ann._id}
                  style={{
                    background: bgColors[ann.type],
                    border: `1px solid ${borderColors[ann.type]}`,
                    borderLeft: `4px solid ${accentColor}`,
                    borderRadius: '14px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    boxShadow: '0 8px 24px -6px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
                    <span style={{ fontSize: '20px', lineHeight: 1 }}>{icons[ann.type]}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: '#f3f4f6', fontSize: '15px', fontWeight: 700 }}>
                          {ann.title}
                        </span>
                        <span style={{
                          fontSize: '11px', padding: '2px 8px', borderRadius: '100px',
                          background: `${accentColor}20`, color: accentColor, fontWeight: 600,
                        }}>
                          Comunicado Oficial
                        </span>
                      </div>
                      <p style={{ color: '#d1d5db', fontSize: '13px', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
                        {ann.message}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAnnouncement(ann._id)}
                    title="Fechar anúncio"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: 'none',
                      color: '#9ca3af',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      flexShrink: 0,
                    }}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Welcome */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            color: '#f9fafb', fontSize: '28px', fontWeight: 700, margin: '0 0 6px',
            letterSpacing: '-0.5px',
          }}>
            Olá, {getFirstName(member.name)} 👋
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px', margin: 0 }}>
            Membro desde {getMemberSince(member.createdAt)} • Bem-vindo à tua área exclusiva NeoLife
          </p>
        </div>

        {/* 📊 2. ESTADO DO PERCURSO / CRM DO LEAD VINCULADO */}
        {leadStatus && leadStatus.status !== 'nao_interessado' && (
          <div style={{
            marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '18px',
            padding: '24px 26px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '18px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: `${currentStatusInfo.color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: currentStatusInfo.color, fontSize: '18px',
                }}>
                  📍
                </div>
                <div>
                  <h3 style={{ color: '#f3f4f6', fontSize: '16px', fontWeight: 700, margin: '0 0 2px' }}>
                    O Teu Percurso com a NeoLife
                  </h3>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>
                    Estado acompanhado em direto pela liderança da equipa
                  </p>
                </div>
              </div>

              <span style={{
                padding: '6px 14px', borderRadius: '100px', fontSize: '12px', fontWeight: 700,
                background: `${currentStatusInfo.color}20`, color: currentStatusInfo.color,
                border: `1px solid ${currentStatusInfo.color}40`,
              }}>
                Etapa: {currentStatusInfo.label}
              </span>
            </div>

            {/* Stepper bar */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '8px',
                marginBottom: '8px',
              }}>
                {[
                  { step: 1, name: 'Análise' },
                  { step: 2, name: 'Contacto' },
                  { step: 3, name: 'Acompanhamento' },
                  { step: 4, name: 'Validado' },
                  { step: 5, name: 'Parceiro Ativo' },
                ].map(s => {
                  const isDone = s.step <= currentStatusInfo.step;
                  const isCurrent = s.step === currentStatusInfo.step;
                  return (
                    <div key={s.step} style={{ textAlign: 'center' }}>
                      <div style={{
                        height: '6px',
                        borderRadius: '3px',
                        background: isDone
                          ? 'linear-gradient(90deg, #10b981, #059669)'
                          : 'rgba(255,255,255,0.06)',
                        boxShadow: isCurrent ? '0 0 10px rgba(16,185,129,0.5)' : 'none',
                        marginBottom: '6px',
                        transition: 'all 0.3s',
                      }} />
                      <span style={{
                        fontSize: '11px',
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? '#10b981' : isDone ? '#9ca3af' : '#4b5563',
                      }}>
                        {s.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin personal notes if present */}
            {leadStatus.notes && (
              <div style={{
                background: 'rgba(16,185,129,0.05)',
                border: '1px dashed rgba(16,185,129,0.25)',
                borderRadius: '12px',
                padding: '14px 16px',
                marginTop: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px' }}>💬</span>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 600 }}>
                    Nota da Liderança para Ti:
                  </span>
                </div>
                <p style={{ color: '#e5e7eb', fontSize: '13px', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
                  &ldquo;{leadStatus.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px', marginBottom: '36px',
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
            label="Materiais Disponíveis"
            value={resources.length.toString()}
            sub="Recursos publicados"
            color="#8b5cf6"
          />
          <StatCard
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
            label="Último Acesso"
            value="Hoje"
            sub={member.lastLoginAt ? new Date(member.lastLoginAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '-'}
            color="#f59e0b"
          />
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

          {/* Left Column: Quick Links + Live Resources Library */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Quick Links */}
            <div>
              <h2 style={{ color: '#e5e7eb', fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>
                Acesso Rápido
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                <QuickLink
                  href="/membro/perfil"
                  label="O Meu Perfil"
                  description="Gerir dados pessoais e senha"
                  color="#10b981"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                />
                <QuickLink
                  href="#materiais"
                  label="Biblioteca"
                  description="Ver materiais e documentos"
                  color="#3b82f6"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>}
                />
                <QuickLink
                  href="/#temas"
                  label="Catálogo Geral"
                  description="Explorar os temas NeoLife"
                  color="#8b5cf6"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>}
                />
                <QuickLink
                  href="/#videos"
                  label="Vídeos Oficiais"
                  description="Apresentações gravadas"
                  color="#f59e0b"
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
                />
              </div>
            </div>

            {/* 📚 3. BIBLIOTECA DE RECURSOS & FORMAÇÃO (PUBLICADA PELO ADMIN) */}
            <div id="materiais" style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '18px',
              padding: '24px',
            }}>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '18px',
              }}>
                <div>
                  <h3 style={{ color: '#f3f4f6', fontSize: '17px', fontWeight: 700, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>📚</span> Recursos & Materiais Exclusivos
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                    Documentos oficiais, guias técnicos e vídeos carregados pela equipa de gestão
                  </p>
                </div>

                {/* Filter chips */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { key: 'all', label: 'Todos' },
                    { key: 'pdf', label: 'PDFs' },
                    { key: 'video', label: 'Vídeos' },
                    { key: 'guide', label: 'Guias' },
                    { key: 'link', label: 'Links' },
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setResourceFilter(tab.key)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        background: resourceFilter === tab.key ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.04)',
                        color: resourceFilter === tab.key ? '#60a5fa' : '#9ca3af',
                        transition: 'all 0.2s',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredResources.length === 0 ? (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  background: 'rgba(255,255,255,0.01)',
                  borderRadius: '12px',
                  border: '1px dashed rgba(255,255,255,0.06)',
                }}>
                  <span style={{ fontSize: '32px' }}>📂</span>
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: '8px 0 2px' }}>
                    Nenhum material publicado nesta categoria no momento.
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '12px', margin: 0 }}>
                    Novos conteúdos estão a ser preparados pela liderança.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                  {filteredResources.map(item => {
                    const icons = { pdf: '📄', video: '🎥', guide: '📘', link: '🔗' };
                    const badgeColors = {
                      pdf: { bg: 'rgba(244,63,94,0.15)', text: '#fb7185' },
                      video: { bg: 'rgba(99,102,241,0.15)', text: '#818cf8' },
                      guide: { bg: 'rgba(16,185,129,0.15)', text: '#34d399' },
                      link: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
                    };
                    const badge = badgeColors[item.type] || badgeColors.link;

                    return (
                      <a
                        key={item._id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: 'none',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '14px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                          e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontSize: '20px' }}>{icons[item.type]}</span>
                            <span style={{
                              padding: '2px 8px', borderRadius: '100px', fontSize: '10px',
                              fontWeight: 700, textTransform: 'uppercase',
                              background: badge.bg, color: badge.text,
                            }}>
                              {item.type}
                            </span>
                          </div>

                          <h4 style={{ color: '#f3f4f6', fontSize: '14px', fontWeight: 600, margin: '0 0 6px', lineHeight: 1.4 }}>
                            {item.title}
                          </h4>

                          {item.description && (
                            <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 12px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)',
                          color: '#60a5fa', fontSize: '12px', fontWeight: 600,
                        }}>
                          <span>Aceder Recurso</span>
                          <span>↗</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
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
                  { label: 'País', value: member.country },
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
                Partilha o teu link único e convida pessoas a juntarem-se à NeoLife.
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
