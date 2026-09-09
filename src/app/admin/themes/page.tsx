'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';

interface ThemeItem {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  slug: string;
  active: boolean;
  order: number;
  image?: string;
  publicId?: string;
  videoUrl?: string;
  content?: string;
}

function ThemesContent() {
  const [themes, setThemes] = useState<ThemeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeItem | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    active: true,
    order: 0,
    image: '',
    publicId: '',
    videoUrl: '',
  });

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      const response = await fetch('/api/admin/themes');
      if (response.ok) {
        const data = await response.json();
        setThemes(data);
      }
    } catch (error) {
      console.error('Error loading themes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (imageUrl: string, publicId: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl, publicId: publicId || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    
    try {
      const themeId = editingTheme ? (editingTheme._id || editingTheme.id) : null;
      const url = themeId 
        ? `/api/admin/themes/${themeId}`
        : '/api/admin/themes';
      
      const method = editingTheme ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await loadThemes();
        setShowAddForm(false);
        setEditingTheme(null);
        setFormData({
          title: '',
          description: '',
          slug: '',
          active: true,
          order: 0,
          image: '',
          publicId: '',
          videoUrl: '',
        });
        setMessage({
          type: 'success',
          text: editingTheme ? 'Tema atualizado com sucesso!' : 'Tema criado com sucesso!'
        });
        setTimeout(() => setMessage(null), 4000);
      } else {
        const errData = await response.json().catch(() => ({}));
        setMessage({
          type: 'error',
          text: errData.error || 'Erro ao guardar o tema.'
        });
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      setMessage({ type: 'error', text: 'Erro ao conectar ao servidor.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (theme: ThemeItem) => {
    setEditingTheme(theme);
    setFormData({
      title: theme.title,
      description: theme.description,
      slug: theme.slug,
      active: theme.active,
      order: theme.order || 0,
      image: theme.image || '',
      publicId: theme.publicId || '',
      videoUrl: theme.videoUrl || '',
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (themeId: string) => {
    if (!confirm('Tem a certeza que deseja apagar este tema?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/themes/${themeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadThemes();
        setMessage({ type: 'success', text: 'Tema apagado com sucesso!' });
        setTimeout(() => setMessage(null), 4000);
      } else {
        setMessage({ type: 'error', text: 'Erro ao apagar o tema.' });
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
      setMessage({ type: 'error', text: 'Erro de comunicação ao apagar o tema.' });
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTheme(null);
    setFormData({
      title: '',
      description: '',
      slug: '',
      active: true,
      order: 0,
      image: '',
      publicId: '',
      videoUrl: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-black">
                ← Voltar
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-black">Gestão de Temas</h1>
            </div>
            <Button onClick={() => {
              if (showAddForm && !editingTheme) {
                setShowAddForm(false);
              } else {
                setEditingTheme(null);
                setFormData({
                  title: '',
                  description: '',
                  slug: '',
                  active: true,
                  order: themes.length + 1,
                  image: '',
                  publicId: '',
                  videoUrl: '',
                });
                setShowAddForm(true);
              }
            }}>
              {showAddForm && !editingTheme ? 'Fechar Formulário' : '+ Novo Tema'}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast / Notification */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold text-black">
                {editingTheme ? 'Editar Tema' : 'Novo Tema'}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Título"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="ex: Oportunidade de Negócio"
                  required
                />

                <Textarea
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Breve descrição dos benefícios e foco deste tema"
                  rows={3}
                  required
                />

                <Input
                  label="Slug (URL amigável)"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="ex: oportunidade-negocio"
                  required
                />

                <Input
                  label="Link do Vídeo / Conteúdo (YouTube, Vimeo, etc.)"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="ex: https://www.youtube.com/watch?v=... ou link explicativo"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Tema (Upload direto para Cloudinary)
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    currentImage={formData.image}
                    folder="neolife/themes"
                  />
                  {formData.image && (
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      URL: {formData.image}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordem de Exibição
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      required
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      name="active"
                      id="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-black"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Ativo no website
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'A guardar...' : editingTheme ? 'Atualizar Tema' : 'Criar Tema'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Themes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">A carregar temas da base de dados...</p>
            </div>
          ) : (
            themes.map((theme) => {
            const keyId = theme._id || theme.id || theme.slug;
            return (
              <Card key={keyId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-black">{theme.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">/{theme.slug}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      theme.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {theme.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  {theme.image ? (
                    <img
                      src={theme.image}
                      alt={theme.title}
                      className="w-full h-40 object-cover rounded-lg mb-4 bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center text-gray-400 text-sm">
                      Sem Imagem
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">{theme.description}</p>
                  {theme.videoUrl && (
                    <div className="mb-4">
                      <a
                        href={theme.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium"
                      >
                        ▶ Ver Vídeo / Conteúdo configurado ↗
                      </a>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Ordem: {theme.order}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(theme)}>
                        Editar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(keyId)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Apagar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}

export default function AdminThemesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    }>
      <ThemesContent />
    </Suspense>
  );
}