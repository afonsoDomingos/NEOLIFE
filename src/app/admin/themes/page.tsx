'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';
import { Theme } from '@/types';

export default function AdminThemesPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    slug: '',
    active: true,
    order: 0,
    image: ''
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (imageUrl: string, publicId: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingTheme 
        ? `/api/admin/themes/${editingTheme.id}`
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
        loadThemes();
        setShowAddForm(false);
        setEditingTheme(null);
        setFormData({
          title: '',
          description: '',
          slug: '',
          active: true,
          order: 0,
          image: ''
        });
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const handleEdit = (theme: Theme) => {
    setEditingTheme(theme);
    setFormData({
      title: theme.title,
      description: theme.description,
      slug: theme.slug,
      active: theme.active,
      order: theme.order,
      image: theme.image || ''
    });
    setShowAddForm(true);
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
        loadThemes();
      }
    } catch (error) {
      console.error('Error deleting theme:', error);
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
      image: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar temas...</p>
        </div>
      </div>
    );
  }

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
            <Button onClick={() => setShowAddForm(true)}>
              + Novo Tema
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  required
                />

                <Textarea
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />

                <Input
                  label="Slug (URL)"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="ex: oportunidade-negocio"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Tema
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    currentImage={formData.image}
                    folder="neolife/themes"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ordem
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
                      Ativo
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit">
                    {editingTheme ? 'Atualizar' : 'Criar'}
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
          {themes.map((theme) => (
            <Card key={theme.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-black">{theme.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{theme.slug}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    theme.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {theme.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {theme.image && (
                  <img
                    src={theme.image}
                    alt={theme.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-sm text-gray-600 mb-4">{theme.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(theme)}>
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(theme.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Apagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}