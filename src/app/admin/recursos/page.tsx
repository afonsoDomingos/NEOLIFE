'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import Link from 'next/link';

interface ResourceItem {
  _id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'link' | 'guide';
  url: string;
  published: boolean;
  order: number;
  createdAt: string;
}

export default function AdminRecursosPage() {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf' as 'pdf' | 'video' | 'link' | 'guide',
    url: '',
    order: 0,
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/resources');
      if (res.ok) {
        const data = await res.json();
        setResources(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFeedback({ type: 'success', text: 'Recurso adicionado com sucesso à biblioteca dos membros!' });
        setFormData({ title: '', description: '', type: 'pdf', url: '', order: 0 });
        setShowAddForm(false);
        loadResources();
      } else {
        const errData = await res.json();
        setFeedback({ type: 'error', text: errData.error || 'Erro ao criar recurso.' });
      }
    } catch {
      setFeedback({ type: 'error', text: 'Falha ao comunicar com o servidor.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/resources', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, published: !currentStatus }),
      });
      if (res.ok) {
        loadResources();
      }
    } catch (err) {
      console.error('Error updating published status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tens a certeza que desejas eliminar este recurso?')) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/resources?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadResources();
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
    }
  };

  const typeConfig = {
    pdf: {
      label: 'PDF / Documento',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: '📄',
    },
    video: {
      label: 'Vídeo / Aula',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      icon: '🎥',
    },
    link: {
      label: 'Link Útil',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: '🔗',
    },
    guide: {
      label: 'Guia / Apresentação',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: '📘',
    },
  };

  const filteredResources = resources.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

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
                <span>📚</span> Biblioteca de Recursos & Materiais
              </h1>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {showAddForm ? '✕ Cancelar' : '+ Novo Recurso'}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Info card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-950 flex items-start gap-3">
          <span className="text-xl mt-0.5">📂</span>
          <div>
            <p className="font-semibold">Materiais e Formação para a Tua Equipa</p>
            <p className="text-xs text-indigo-800 mt-0.5">
              Disponibiliza catálogos de produtos em PDF, links para fichas técnicas, gravações de formações ou guiões de apresentação. Tudo o que for publicado aqui fica acessível na secção &ldquo;Biblioteca de Recursos&rdquo; do dashboard de cada membro.
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

        {/* Add Resource Form */}
        {showAddForm && (
          <Card className="border-2 border-indigo-500/30 shadow-lg">
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>➕</span> Adicionar Material à Biblioteca
              </h2>
              <p className="text-xs text-gray-500">
                Adiciona documentos, vídeos ou links importantes para os membros.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      label="Título do Material *"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Ex: Catálogo Oficial NeoLife 2026 PDF"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Conteúdo *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="pdf">📄 PDF / Documento</option>
                      <option value="video">🎥 Vídeo / Aula Gravada</option>
                      <option value="link">🔗 Link Externo / Portal</option>
                      <option value="guide">📘 Guia / Apresentação</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="URL do Recurso / Link de Acesso *"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://exemplo.com/catalogo.pdf ou link do Google Drive / YouTube"
                  required
                />

                <Textarea
                  label="Descrição Breve"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Ex: Guia com os preços de distribuidor e benefícios nutricionais da linha Pro Vitality."
                />

                <div className="w-48">
                  <Input
                    label="Ordem de Exibição"
                    name="order"
                    type="number"
                    value={formData.order.toString()}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                  <p className="text-[11px] text-gray-400 mt-0.5">Números menores aparecem primeiro.</p>
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
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={submitting}
                  >
                    {submitting ? 'A guardar...' : 'Guardar Recurso'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Resources Filter & List */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'pdf', 'video', 'link', 'guide'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                    filterType === t
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {t === 'all' ? `Todos (${resources.length})` : `${typeConfig[t as keyof typeof typeConfig]?.label || t}`}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={loadResources}
              className="text-xs text-gray-600 self-end sm:self-auto"
            >
              🔄 Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-36 bg-white border border-gray-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filteredResources.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <span className="text-4xl">📚</span>
                <h3 className="text-base font-semibold text-gray-900 mt-2">Nenhum recurso encontrado</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  Adiciona materiais de apoio, manuais ou vídeos para ajudar os teus membros a terem sucesso.
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  size="sm"
                  className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs"
                >
                  + Adicionar Primeiro Recurso
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(item => {
                const conf = typeConfig[item.type] || typeConfig.link;

                return (
                  <Card
                    key={item._id}
                    className={`flex flex-col justify-between transition-all ${
                      item.published ? 'border-gray-200 hover:shadow-md' : 'border-gray-200 opacity-60 bg-gray-50'
                    }`}
                  >
                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${conf.badge}`}
                          >
                            {conf.icon} {conf.label}
                          </span>

                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              item.published
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            {item.published ? '● Visível' : '○ Oculto'}
                          </span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        >
                          <span>Abrir Link</span>
                          <span>↗</span>
                        </a>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublished(item._id, item.published)}
                            className="text-[11px] px-2 py-1 h-7"
                          >
                            {item.published ? 'Ocultar' : 'Mostrar'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item._id)}
                            className="text-[11px] px-2 py-1 h-7 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
