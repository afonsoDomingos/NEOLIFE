'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import Link from 'next/link';
import { extractYouTubeId, getEmbedUrl } from '@/lib/utils/video';

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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Apresentação',
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

      const payload = {
        ...formData,
        ...(videoId ? { _id: videoId } : {})
      };

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
          category: 'Apresentação',
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
      category: video.category || 'Apresentação',
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

  const detectedYouTubeId = extractYouTubeId(formData.videoUrl);
  const embedPreviewUrl = getEmbedUrl(formData.videoUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-black font-medium text-sm">
                ← Voltar
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-black">
                Gestão de Vídeos
              </h1>
            </div>
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
                    category: 'Apresentação',
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
        </div>
      </header>

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
                      Categoria
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                    >
                      <option value="Apresentação">Apresentação Geral</option>
                      <option value="Negócio">Oportunidade de Negócio</option>
                      <option value="Produtos">Produtos & Nutrição</option>
                      <option value="Testemunhos">Testemunhos & Histórias</option>
                      <option value="Tutoriais">Como Começar / Tutoriais</option>
                    </select>
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

                <Input
                  label="Imagem de Capa Personalizada (Opcional - link de imagem)"
                  name="thumbnailUrl"
                  value={formData.thumbnailUrl}
                  onChange={handleInputChange}
                  placeholder="Deixe em branco para usar automaticamente a capa do YouTube"
                />

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

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
              <p className="text-sm">A carregar vídeos da base de dados...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="font-semibold text-gray-700">Nenhum vídeo registado</p>
              <p className="text-sm text-gray-500 mt-1">Clique em "+ Novo Vídeo" para adicionar o primeiro vídeo ao site.</p>
            </div>
          ) : (
            videos.map((v) => {
              const videoId = v._id || v.id || v.videoUrl;
              const thumb = v.thumbnailUrl || (extractYouTubeId(v.videoUrl) ? `https://img.youtube.com/vi/${extractYouTubeId(v.videoUrl)}/hqdefault.jpg` : '');
              const embedUrl = getEmbedUrl(v.videoUrl);

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
              ✕
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
