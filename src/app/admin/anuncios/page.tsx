'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import Link from 'next/link';

interface AnnouncementItem {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  active: boolean;
  expiresAt?: string;
  createdAt: string;
}

export default function AdminAnunciosPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning',
    expiresAt: '',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/announcements');
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          message: formData.message,
          type: formData.type,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : undefined,
        }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Anúncio publicado com sucesso para todos os membros!' });
        setFormData({ title: '', message: '', type: 'info', expiresAt: '' });
        setShowAddForm(false);
        loadAnnouncements();
      } else {
        const errData = await res.json();
        setFeedback({ type: 'error', text: errData.error || 'Erro ao publicar anúncio.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Falha na comunicação com o servidor.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentStatus }),
      });
      if (res.ok) {
        loadAnnouncements();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que desejas eliminar este anúncio? Deixará de ser visível aos membros.')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadAnnouncements();
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
    }
  };

  const typeConfig = {
    info: {
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      banner: 'bg-blue-50 border-blue-400 text-blue-900',
      icon: 'ℹ️',
      label: 'Informação',
    },
    success: {
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      banner: 'bg-emerald-50 border-emerald-400 text-emerald-900',
      icon: '🎉',
      label: 'Sucesso / Novidade',
    },
    warning: {
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      banner: 'bg-amber-50 border-amber-400 text-amber-900',
      icon: '⚠️',
      label: 'Alerta Importante',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-black text-sm flex items-center gap-1">
                ← Voltar ao Painel
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-black flex items-center gap-2">
                <span>📣</span> Anúncios & Avisos aos Membros
              </h1>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {showAddForm ? '✕ Cancelar' : '+ Novo Anúncio'}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Info banner */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900 flex items-start gap-3">
          <span className="text-xl mt-0.5">💡</span>
          <div>
            <p className="font-semibold text-emerald-950">Comunicação Direta com Membros</p>
            <p className="text-xs text-emerald-800 mt-0.5">
              Os anúncios ativos publicados aqui surgem imediatamente no topo da área privada de todos os membros autenticados. Podes usá-los para convocações de webinars, lançamentos de campanhas ou comunicados da liderança.
            </p>
          </div>
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl border text-sm flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <span>{feedback.text}</span>
            <button onClick={() => setFeedback(null)} className="text-xs font-bold underline ml-4">
              Fechar
            </button>
          </div>
        )}

        {/* Add Announcement Form */}
        {showAddForm && (
          <Card className="border-2 border-emerald-500/30 shadow-lg animate-in fade-in duration-200">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>✍️</span> Criar Novo Comunicado
              </h2>
              <p className="text-xs text-gray-500">
                Preenche os campos abaixo para exibir o comunicado na área dos membros.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Título do Comunicado *"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Treinamento Especial de Liderança na Terça-feira"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Aviso *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="info">ℹ️ Informativo (Azul)</option>
                      <option value="success">🎉 Sucesso / Conquista (Verde)</option>
                      <option value="warning">⚠️ Urgente / Alerta (Amarelo)</option>
                    </select>
                  </div>
                </div>

                <Textarea
                  label="Mensagem / Conteúdo *"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Escreve aqui os detalhes, links de reunião Zoom ou instruções para a equipa..."
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Expiração (Opcional)
                    </label>
                    <input
                      type="date"
                      name="expiresAt"
                      value={formData.expiresAt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Após esta data o aviso deixa de aparecer automaticamente.</p>
                  </div>

                  {/* Live Preview */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Pré-visualização ao Vivo
                    </p>
                    <div
                      className={`p-3.5 rounded-xl border-l-4 shadow-sm text-sm ${
                        typeConfig[formData.type].banner
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold">
                        <span>{typeConfig[formData.type].icon}</span>
                        <span>{formData.title || 'Título do comunicado...'}</span>
                      </div>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">
                        {formData.message || 'O texto da mensagem aparecerá aqui para o membro.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={submitting}
                  >
                    {submitting ? 'A publicar...' : 'Publicar Comunicado'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-gray-900">
              Todos os Anúncios ({announcements.length})
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnnouncements}
              className="text-xs text-gray-600"
            >
              🔄 Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white border border-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <span className="text-4xl">📢</span>
                <h3 className="text-base font-semibold text-gray-900 mt-2">Nenhum anúncio registado</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Cria o primeiro comunicado acima para informar os membros sobre eventos, produtos ou novidades NeoLife.
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                >
                  + Criar Anúncio
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {announcements.map(item => {
                const conf = typeConfig[item.type] || typeConfig.info;
                const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date();

                return (
                  <div
                    key={item._id}
                    className={`bg-white rounded-xl border transition-all p-5 shadow-sm hover:shadow ${
                      item.active && !isExpired ? 'border-gray-200' : 'border-gray-200 opacity-60 bg-gray-50/70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${conf.badge}`}
                          >
                            {conf.icon} {conf.label}
                          </span>

                          {item.active && !isExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ● Ativo (visível)
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                              ⌛ Expirado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-200 text-gray-700">
                              ○ Inativo (oculto)
                            </span>
                          )}

                          <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString('pt-PT', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-base">{item.title}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
                          {item.message}
                        </p>

                        {item.expiresAt && (
                          <p className="text-xs text-gray-400">
                            Expira em: {new Date(item.expiresAt).toLocaleDateString('pt-PT')}
                          </p>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 pt-2 sm:pt-0 self-end sm:self-start">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(item._id, item.active)}
                          className="text-xs"
                          title={item.active ? 'Ocultar aos membros' : 'Tornar visível aos membros'}
                        >
                          {item.active ? 'Ocultar' : 'Ativar'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                          className="text-xs text-red-600 hover:bg-red-50 hover:border-red-300"
                          title="Eliminar permanentemente"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
