'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  status: 'pending' | 'active' | 'suspended';
  plan: string;
  referralCode: string;
  createdAt: string;
  lastLoginAt?: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: 'Ativo',     color: '#059669', bg: '#d1fae5' },
  pending:   { label: 'Pendente',  color: '#d97706', bg: '#fef3c7' },
  suspended: { label: 'Suspenso',  color: '#dc2626', bg: '#fee2e2' },
};

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ status: '', plan: '' });
  const [createForm, setCreateForm] = useState({
    name: '', email: '', password: '', phone: '', country: '', plan: '', status: 'active',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadMembers();
  }, [filterStatus]);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      const res = await fetch(`/api/admin/members?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
        setTotal(data.total || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (m: Member) => {
    setSelectedMember(m);
    setEditForm({ status: m.status, plan: m.plan || '' });
    setShowModal(true);
    setMessage(null);
  };

  const handleSaveEdit = async () => {
    if (!selectedMember) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/members/${selectedMember._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error });
      } else {
        setMessage({ type: 'success', text: 'Membro atualizado.' });
        loadMembers();
        setTimeout(() => setShowModal(false), 1200);
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao guardar.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem a certeza que deseja remover este membro?')) return;
    try {
      await fetch(`/api/admin/members/${id}`, { method: 'DELETE' });
      loadMembers();
      setShowModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error });
      } else {
        setMessage({ type: 'success', text: 'Membro criado com sucesso.' });
        setCreateForm({ name: '', email: '', password: '', phone: '', country: '', plan: '', status: 'active' });
        loadMembers();
        setTimeout(() => setShowCreateModal(false), 1200);
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao criar.' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.country.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1px solid #e5e7eb', background: 'white',
    color: '#111827', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo-neolife.png" alt="NeoLife" className="h-9 w-auto object-contain" />
              <span className="text-gray-300">|</span>
              <span className="text-gray-700 font-semibold text-sm">Painel de Administracao</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm" className="text-xs text-gray-600">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestao de Membros</h1>
            <p className="text-sm text-gray-500 mt-1">{total} membro(s) registado(s)</p>
          </div>
          <button
            id="create-member-btn"
            onClick={() => { setShowCreateModal(true); setMessage(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Membro
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <input
            id="members-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar por nome, email ou pais..."
            style={{ ...inputStyle, maxWidth: '320px', flex: '1 1 200px' }}
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{ ...inputStyle, maxWidth: '160px', flex: '0 0 auto' }}
          >
            <option value="">Todos os estados</option>
            <option value="active">Ativo</option>
            <option value="pending">Pendente</option>
            <option value="suspended">Suspenso</option>
          </select>
          <button
            onClick={loadMembers}
            style={{
              padding: '9px 16px', borderRadius: '8px', border: '1px solid #e5e7eb',
              background: 'white', color: '#374151', fontSize: '14px', cursor: 'pointer',
            }}
          >
            Atualizar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total', value: total, color: '#6366f1' },
            { label: 'Ativos', value: members.filter(m => m.status === 'active').length, color: '#10b981' },
            { label: 'Suspensos', value: members.filter(m => m.status === 'suspended').length, color: '#ef4444' },
          ].map(s => (
            <Card key={s.label} className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card className="shadow-sm overflow-hidden">
          <CardHeader className="border-b border-gray-100 pb-3">
            <h2 className="font-semibold text-gray-900 text-sm">Lista de Membros</h2>
          </CardHeader>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  {['Nome', 'Email', 'Pais', 'Plano', 'Estado', 'Membro desde', 'Acoes'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} style={{ padding: '12px 16px' }}>
                          <div style={{ height: '14px', background: '#f3f4f6', borderRadius: '4px', width: `${60 + Math.random() * 30}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                      Nenhum membro encontrado
                    </td>
                  </tr>
                ) : (
                  filtered.map((m, i) => {
                    const st = STATUS_LABELS[m.status] || STATUS_LABELS.active;
                    return (
                      <tr
                        key={m._id}
                        style={{
                          borderBottom: '1px solid #f3f4f6',
                          background: i % 2 === 0 ? 'white' : '#fafafa',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#f0fdf4'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = i % 2 === 0 ? 'white' : '#fafafa'; }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: '12px', fontWeight: 700,
                            }}>
                              {m.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500, color: '#111827' }}>{m.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{m.email}</td>
                        <td style={{ padding: '12px 16px', color: '#374151' }}>{m.country}</td>
                        <td style={{ padding: '12px 16px', color: '#374151' }}>{m.plan || '-'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: '100px',
                            background: st.bg, color: st.color,
                            fontSize: '12px', fontWeight: 600,
                          }}>
                            {st.label}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '12px' }}>
                          {new Date(m.createdAt).toLocaleDateString('pt-PT')}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button
                            onClick={() => openEdit(m)}
                            style={{
                              padding: '6px 14px', borderRadius: '6px', border: '1px solid #e5e7eb',
                              background: 'white', color: '#374151', fontSize: '12px',
                              cursor: 'pointer', fontWeight: 500, transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#059669'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      {showModal && selectedMember && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px',
        }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                Editar Membro
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Member info */}
            <div style={{ background: '#f9fafb', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
              <p style={{ fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>{selectedMember.name}</p>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 2px' }}>{selectedMember.email}</p>
              <p style={{ color: '#9ca3af', fontSize: '12px', margin: 0 }}>{selectedMember.phone} - {selectedMember.country}</p>
            </div>

            {message && (
              <div style={{
                background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: message.type === 'success' ? '#065f46' : '#991b1b',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px',
              }}>
                {message.text}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Estado</label>
                <select
                  value={editForm.status}
                  onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="active">Ativo</option>
                  <option value="pending">Pendente</option>
                  <option value="suspended">Suspenso</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Plano</label>
                <input
                  type="text"
                  value={editForm.plan}
                  onChange={e => setEditForm(f => ({ ...f, plan: e.target.value }))}
                  placeholder="ex: Construcao Civil"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleDelete(selectedMember._id)}
                style={{
                  flex: 1, padding: '11px', borderRadius: '8px',
                  border: '1px solid #fee2e2', background: 'white', color: '#dc2626',
                  fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                }}
              >
                Remover
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                style={{
                  flex: 2, padding: '11px', borderRadius: '8px', border: 'none',
                  background: saving ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'A guardar...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '24px',
        }} onClick={e => { if (e.target === e.currentTarget) setShowCreateModal(false); }}>
          <div style={{
            background: 'white', borderRadius: '16px', padding: '32px',
            width: '100%', maxWidth: '520px', boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                Criar Novo Membro
              </h2>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {message && (
              <div style={{
                background: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                color: message.type === 'success' ? '#065f46' : '#991b1b',
                borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px',
              }}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Nome *</label>
                  <input type="text" value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} required placeholder="Nome completo" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email *</label>
                  <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} required placeholder="email@exemplo.com" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Senha *</label>
                  <input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} required placeholder="Min. 6 caracteres" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Telefone *</label>
                  <input type="tel" value={createForm.phone} onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))} required placeholder="+258 84 000 0000" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Pais *</label>
                  <input type="text" value={createForm.country} onChange={e => setCreateForm(f => ({ ...f, country: e.target.value }))} required placeholder="ex: Mocambique" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Plano</label>
                  <input type="text" value={createForm.plan} onChange={e => setCreateForm(f => ({ ...f, plan: e.target.value }))} placeholder="ex: Construcao Civil" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Estado inicial</label>
                <select value={createForm.status} onChange={e => setCreateForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
                  <option value="active">Ativo</option>
                  <option value="pending">Pendente</option>
                  <option value="suspended">Suspenso</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #e5e7eb',
                    background: 'white', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    flex: 2, padding: '11px', borderRadius: '8px', border: 'none',
                    background: saving ? 'rgba(16,185,129,0.5)' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white', fontSize: '14px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {saving ? 'A criar...' : 'Criar Membro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
