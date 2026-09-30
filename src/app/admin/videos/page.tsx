'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';
import { extractYouTubeId, getEmbedUrl } from '@/lib/utils/video';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface VideoItem {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  featured: boolean;
  active: boolean;
  order: number;
}

function VideosContent() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [destinationFilter, setDestinationFilter] = useState<'all' | 'business' | 'experiencias' | 'saude'>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    thumbnailPublicId: '',
    category: 'Apresentação',
    customCategory: '',
    featured: false,
    active: true,
    order: 0,
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const videoId = editingVideo ? (editingVideo._id || editingVideo.id) : null;
      const url = videoId
        ? `/api/admin/videos/${videoId}`
        : '/api/admin/videos';

      const method = videoId ? 'PUT' : 'POST';

      // Use custom category if selected, otherwise use the dropdown value
      const finalCategory = formData.category === 'custom' ? formData.customCategory : formData.category;

      const payload = {
        ...formData,
        category: finalCategory,
        ...(videoId ? { _id: videoId } : {})
      };

      // Remove customCategory from payload (it's only for the form)
      delete (payload as any).customCategory;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadVideos();
        setShowAddForm(false);
        setEditingVideo(null);
        setFormData({
          title: '',
          description: '',
          videoUrl: '',
          thumbnailUrl: '',
          thumbnailPublicId: '',
          category: 'Apresentação',
          customCategory: '',
          featured: false,
          active: true,
          order: 0,
        });
        setMessage({
          type: 'success',
          text: editingVideo ? 'Vídeo atualizado com sucesso!' : 'Vídeo adicionado com sucesso!'
        });
        setTimeout(() => setMessage(null), 4000);
      } else {
        const err = await response.json().catch(() => ({}));
        setMessage({ type: 'error', text: err.error || 'Erro ao guardar vídeo.' });
      }
    } catch (error) {
      console.error('Error saving video:', error);
      setMessage({ type: 'error', text: 'Erro ao conectar ao servidor.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (video: VideoItem) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl || '',
      thumbnailPublicId: (video as any).thumbnailPublicId || '',
      category: video.category || 'Apresentação',
      customCategory: '',
      featured: !!video.featured,
      active: video.active !== undefined ? video.active : true,
      order: video.order || 0,
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Tem a certeza que deseja apagar o vídeo "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await loadVideos();
        setMessage({ type: 'success', text: 'Vídeo apagado com sucesso!' });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: 'error', text: 'Erro ao apagar vídeo.' });
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      setMessage({ type: 'error', text: 'Erro ao conectar ao servidor.' });
    }
  };

  const handleThumbnailUpload = (imageUrl: string, publicId: string) => {
    setFormData(prev => ({
      ...prev,
      thumbnailUrl: imageUrl,
      thumbnailPublicId: publicId
    }));
  };

  const detectedYouTubeId = extractYouTubeId(formData.videoUrl);
  const embedPreviewUrl = getEmbedUrl(formData.videoUrl);

  // Standard categories for consistent styling
  const standardCategories = [
    'Business',
    'Negócio',
    'Tutoriais',
    'Experiências',
    'Viagens',
    'Reconhecimento',
    'Testemunhos',
    'Produtos',
    'Apresentação',
  ];

  const getDestination = (category: string) => {
    if (['Business', 'Negócio', 'Negocio', 'Tutoriais'].includes(category)) {
      return {
        id: 'business',
        name: 'Página Business',
        badge: '🏢 Página Business (/business)',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        page: '/business',
      };
    }
    if (['Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(category)) {
      return {
        id: 'experiencias',
        name: 'Página Experiências',
        badge: '✈️ Página Experiências (/experiencias)',
        color: 'bg-teal-50 text-teal-800 border-teal-300',
        page: '/experiencias',
      };
    }
    if (category === 'Produtos') {
      return {
        id: 'saude',
        name: 'Produtos & Saúde',
        badge: '🌿 Produtos & Nutrição (/saude)',
        color: 'bg-green-50 text-green-800 border-green-300',
        page: '/saude',
      };
    }
    return {
      id: 'outros',
      name: 'Geral',
      badge: '🌐 Geral / Institucional',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      page: '/',
    };
  };

  // Get all unique categories from videos
  const allCategories = ['all', ...Array.from(new Set(videos.map(v => v.category).filter(Boolean)))];
  const customCategories = allCategories.filter(cat => cat !== 'all' && !standardCategories.includes(cat));

  // Category labels for display
  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'all': 'Todos',
      'Business': 'Business (5 Blocos)',
      'Negócio': 'Negócio (Aulas)',
      'Tutoriais': 'Tutoriais',
      'Experiências': 'Experiências',
      'Experiencias': 'Experiências',
      'Viagens': 'Viagens',
      'Reconhecimento': 'Reconhecimento',
      'Testemunhos': 'Testemunhos',
      'Produtos': 'Produtos',
      'Apresentação': 'Apresentação',
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        title="Gestão de Vídeos"
        showRefresh={true}
        onRefresh={loadVideos}
      />

      {/* Page-specific toolbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Button
          onClick={() => {
            if (showAddForm && !editingVideo) {
              setShowAddForm(false);
            } else {
              setEditingVideo(null);
              setFormData({
                title: '',
                description: '',
                videoUrl: '',
                thumbnailUrl: '',
                thumbnailPublicId: '',
                category: 'Apresentação',
                customCategory: '',
                featured: false,
                active: true,
                order: videos.length + 1,
              });
              setShowAddForm(true);
            }
          }}
        >
          {showAddForm && !editingVideo ? 'Fechar Formulário' : '+ Novo Vídeo'}
        </Button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Feedback Message */}
        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="border-emerald-200 shadow-md">
            <CardHeader className="border-b border-gray-100">
              <h2 className="text-lg font-bold text-black">
                {editingVideo ? 'Editar Vídeo' : 'Novo Vídeo'}
              </h2>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Título do Vídeo"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="ex: Conheça a Oportunidade NeoLife"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destino & Categoria
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                    >
                      <optgroup label="🏢 Página Business (/business)">
                        <option value="Business">Business — 5 Blocos Sequenciais (Ordem 1 a 5)</option>
                        <option value="Negócio">Business — Apresentação da Oportunidade</option>
                        <option value="Tutoriais">Business — Tutoriais & Registo Passo a Passo</option>
                      </optgroup>
                      <optgroup label="✈️ Página Experiências (/experiencias)">
                        <option value="Experiências">Experiências — Geral / Estilo de Vida</option>
                        <option value="Viagens">Experiências — Viagens & Destinos Internacionais</option>
                        <option value="Reconhecimento">Experiências — Reconhecimento & Celebrações</option>
                        <option value="Testemunhos">Experiências — Testemunhos e Histórias Reais</option>
                      </optgroup>
                      <optgroup label="🌿 Saúde & Outros">
                        <option value="Produtos">Produtos & Nutrição (Pilar Saúde)</option>
                        <option value="Apresentação">Apresentação Geral NeoLife</option>
                        <option value="custom">✨ Criar Nova Categoria</option>
                      </optgroup>
                    </select>

                    {formData.category === 'custom' && (
                      <div className="mt-2">
                        <Input
                          label="Nome da Nova Categoria"
                          name="customCategory"
                          value={formData.customCategory}
                          onChange={handleInputChange}
                          placeholder="ex: Treinamentos, Eventos, etc."
                          required
                        />
                      </div>
                    )}

                    {formData.category === 'Business' && (
                      <div className="mt-2.5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 leading-relaxed space-y-1.5">
                        <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <span>🏢</span> Destino: 5 Blocos Interativos na Página Business (/business)
                        </p>
                        <p className="text-gray-700">
                          Defina o campo <strong>Ordem</strong> abaixo de 1 a 5 para preencher o respetivo bloco:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1 font-mono text-[11px] text-emerald-900">
                          <div>• <strong>Ordem 1:</strong> Bloco 01 — Fundamentos</div>
                          <div>• <strong>Ordem 2:</strong> Bloco 02 — Funcionamento</div>
                          <div>• <strong>Ordem 3:</strong> Bloco 03 — Acompanhamento</div>
                          <div>• <strong>Ordem 4:</strong> Bloco 04 — Escala & Ganhos</div>
                          <div>• <strong>Ordem 5:</strong> Bloco 05 — Ação Imediata</div>
                        </div>
                      </div>
                    )}

                    {['Negócio', 'Tutoriais'].includes(formData.category) && (
                      <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                        <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <span>🏢</span> Destino: Galeria da Página Business (/business)
                        </p>
                        <p className="text-gray-700 mt-1">
                          Este vídeo será exibido na galeria de <strong>Aulas & Apresentações de Negócio</strong> em <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-900">/business</code>.
                        </p>
                      </div>
                    )}

                    {['Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(formData.category) && (
                      <div className="mt-2.5 p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-950 leading-relaxed">
                        <p className="font-bold flex items-center gap-1.5 text-teal-800">
                          <span>✈️</span> Destino: Galeria da Página Experiências (/experiencias)
                        </p>
                        <p className="text-gray-700 mt-1">
                          Este vídeo será exibido na galeria de <strong>Viagens, Convenções e Celebrações</strong> em <code className="bg-teal-100 px-1 py-0.5 rounded text-teal-900">/experiencias</code>.
                        </p>
                      </div>
                    )}

                    {formData.category === 'Produtos' && (
                      <div className="mt-2.5 p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-950 leading-relaxed">
                        <p className="font-bold flex items-center gap-1.5 text-green-800">
                          <span>🌿</span> Destino: Pilar de Saúde & Nutrição (/saude)
                        </p>
                        <p className="text-gray-700 mt-1">
                          Este vídeo aborda a eficácia e ciência nutricional da NeoLife.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Input
                  label="URL do Vídeo (YouTube, Vimeo ou MP4)"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=... ou https://youtu.be/..."
                  required
                />

                {detectedYouTubeId && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                    Vídeo do YouTube detetado (ID: <strong>{detectedYouTubeId}</strong>). A capa será obtida automaticamente se não definir outra.
                  </div>
                )}

                {/* Video Live Preview */}
                {embedPreviewUrl && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2">
                      Pré-visualização do Reprodutor:
                    </label>
                    <div className="aspect-video max-w-lg rounded-lg overflow-hidden border border-gray-200 bg-black shadow-inner">
                      <iframe
                        src={embedPreviewUrl}
                        title="Pré-visualização do Vídeo"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                <Textarea
                  label="Descrição / Pontos Principais"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Explicação breve do que os visitantes irão aprender neste vídeo..."
                  rows={3}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imagem de Capa
                  </label>
                  <div className="space-y-3">
                    {/* Upload Option */}
                    <ImageUpload
                      onUpload={handleThumbnailUpload}
                      currentImage={formData.thumbnailUrl}
                      folder="neolife/videos"
                      className="mb-3"
                    />

                    {/* Or use URL link */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou usar link de imagem</span>
                      </div>
                    </div>

                    <Input
                      label="URL da Imagem (Opcional)"
                      name="thumbnailUrl"
                      value={formData.thumbnailUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />

                    <p className="text-xs text-gray-500">
                      Deixe em branco para usar automaticamente a capa do YouTube
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ordem de Exibição
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="featured"
                      id="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700 font-medium">
                      Vídeo em Destaque Principal
                    </label>
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="active"
                      id="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700 font-medium">
                      Ativo no website
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingVideo(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'A guardar...' : editingVideo ? 'Atualizar Vídeo' : 'Guardar Vídeo'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Destination Page Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-gray-200">
          <span className="text-xs font-bold text-gray-700 mr-2">Filtrar por Destino:</span>
          <button
            type="button"
            onClick={() => { setDestinationFilter('all'); setFilterCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              destinationFilter === 'all'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Todos ({videos.length})
          </button>
          <button
            type="button"
            onClick={() => { setDestinationFilter('business'); setFilterCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              destinationFilter === 'business'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <span>🏢</span>
            <span>Página Business ({videos.filter(v => ['Business', 'Negócio', 'Negocio', 'Tutoriais'].includes(v.category)).length})</span>
          </button>
          <button
            type="button"
            onClick={() => { setDestinationFilter('experiencias'); setFilterCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              destinationFilter === 'experiencias'
                ? 'bg-teal-700 text-white shadow-sm'
                : 'bg-white text-teal-800 border border-teal-200 hover:bg-teal-50'
            }`}
          >
            <span>✈️</span>
            <span>Página Experiências ({videos.filter(v => ['Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(v.category)).length})</span>
          </button>
          <button
            type="button"
            onClick={() => { setDestinationFilter('saude'); setFilterCategory('all'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              destinationFilter === 'saude'
                ? 'bg-green-700 text-white shadow-sm'
                : 'bg-white text-green-800 border border-green-200 hover:bg-green-50'
            }`}
          >
            <span>🌿</span>
            <span>Saúde & Outros ({videos.filter(v => !['Business', 'Negócio', 'Negocio', 'Tutoriais', 'Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(v.category)).length})</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 mr-1">Categoria:</span>
          {allCategories.map((category) => {
            const count = category === 'all' ? videos.length : videos.filter((v) => v.category === category).length;
            const isSelected = filterCategory === category;
            const isCustom = !standardCategories.includes(category) && category !== 'all';
            return (
              <button
                key={category}
                type="button"
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                } ${isCustom ? 'ring-2 ring-purple-200' : ''}`}
              >
                {isCustom && <span className="text-purple-600">✨</span>}
                <span>{getCategoryLabel(category)}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
              <p className="text-sm">A carregar vídeos da base de dados...</p>
            </div>
          ) : videos
              .filter((v) => {
                const categoryMatch = filterCategory === 'all' || v.category === filterCategory;
                let destinationMatch = true;
                if (destinationFilter === 'business') {
                  destinationMatch = ['Business', 'Negócio', 'Negocio', 'Tutoriais'].includes(v.category);
                } else if (destinationFilter === 'experiencias') {
                  destinationMatch = ['Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(v.category);
                } else if (destinationFilter === 'saude') {
                  destinationMatch = !['Business', 'Negócio', 'Negocio', 'Tutoriais', 'Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(v.category);
                }
                return categoryMatch && destinationMatch;
              }).length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="font-semibold text-gray-700">Nenhum vídeo com os filtros selecionados</p>
              <p className="text-sm text-gray-500 mt-1">
                {destinationFilter === 'experiencias'
                  ? 'Clique em "+ Novo Vídeo" e selecione "Experiências", "Viagens" ou "Reconhecimento" para alimentar a página /experiencias.'
                  : destinationFilter === 'business'
                  ? 'Clique em "+ Novo Vídeo" e selecione "Business" (ordem 1 a 5 para os blocos) ou "Negócio" para a página /business.'
                  : 'Clique em "+ Novo Vídeo" para adicionar um vídeo ao site.'}
              </p>
            </div>
          ) : (
            videos
              .filter((v) => {
                const categoryMatch = filterCategory === 'all' || v.category === filterCategory;
                let destinationMatch = true;
                if (destinationFilter === 'business') {
                  destinationMatch = ['Business', 'Negócio', 'Negocio', 'Tutoriais'].includes(v.category);
                } else if (destinationFilter === 'experiencias') {
                  destinationMatch = ['Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(v.category);
                } else if (destinationFilter === 'saude') {
                  destinationMatch = !['Business', 'Negócio', 'Negocio', 'Tutoriais', 'Experiências', 'Experiencias', 'Viagens', 'Reconhecimento', 'Testemunhos'].includes(v.category);
                }
                return categoryMatch && destinationMatch;
              })
              .map((v) => {
              const videoId = v._id || v.id || v.videoUrl;
              const thumb = v.thumbnailUrl || (extractYouTubeId(v.videoUrl) ? `https://img.youtube.com/vi/${extractYouTubeId(v.videoUrl)}/hqdefault.jpg` : '');
              const embedUrl = getEmbedUrl(v.videoUrl);
              const dest = getDestination(v.category);

              return (
                <Card key={videoId} className="shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
                  <div>
                    {/* Thumbnail with play overlay */}
                    <div className="relative aspect-video bg-gray-900 overflow-hidden group cursor-pointer" onClick={() => setPreviewModalUrl(embedUrl)}>
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={v.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-xs">
                          Sem Capa
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          ▶
                        </div>
                      </div>
                      <div className="absolute top-2 left-2 flex gap-1">
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-black/70 text-white backdrop-blur-sm">
                          {v.category || 'Vídeo'}
                        </span>
                        {v.featured && (
                          <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-500 text-white shadow">
                            Destaque
                          </span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                          v.active ? 'bg-emerald-600 text-white' : 'bg-gray-600 text-gray-200'
                        }`}>
                          {v.active ? 'Ativo' : 'Oculto'}
                        </span>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${dest.color}`}>
                          {dest.badge}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base line-clamp-2 mb-1">{v.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{v.description || 'Sem descrição.'}</p>
                      <a
                        href={v.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-800 truncate block underline font-medium"
                      >
                        {v.videoUrl}
                      </a>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-2 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <span className="text-xs text-gray-400">Ordem: {v.order}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(v)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(videoId, v.title)}
                        className="text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        Apagar
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Video Modal Player */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div
            className="bg-black rounded-xl overflow-hidden shadow-2xl w-full max-w-3xl aspect-video relative border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg transition-colors"
            >
              X
            </button>
            <iframe
              src={`${previewModalUrl}?autoplay=1`}
              title="Vídeo NeoLife"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminVideosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-3"></div>
          <p className="text-gray-600">A carregar gestão de vídeos...</p>
        </div>
      </div>
    }>
      <VideosContent />
    </Suspense>
  );
}
