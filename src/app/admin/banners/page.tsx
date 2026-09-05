'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  buttonText?: string;
  active: boolean;
  order: number;
  startDate?: string;
  endDate?: string;
}

function BannersContent() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    buttonText: '',
    active: true,
    order: 0,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/admin/banners');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
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
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingBanner 
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners';
      
      const method = editingBanner ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        loadBanners();
        setShowAddForm(false);
        setEditingBanner(null);
        setFormData({
          title: '',
          description: '',
          image: '',
          link: '',
          buttonText: '',
          active: true,
          order: 0,
          startDate: '',
          endDate: ''
        });
      }
    } catch (error) {
      console.error('Error saving banner:', error);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      link: banner.link || '',
      buttonText: banner.buttonText || '',
      active: banner.active,
      order: banner.order,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (!confirm('Tem a certeza que deseja apagar este banner?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/banners/${bannerId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadBanners();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      buttonText: '',
      active: true,
      order: 0,
      startDate: '',
      endDate: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar banners...</p>
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
              <h1 className="text-xl font-bold text-black">Gestão de Banners</h1>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              + Novo Banner
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
                {editingBanner ? 'Editar Banner' : 'Novo Banner'}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Banner
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    currentImage={formData.image}
                    folder="neolife/banners"
                  />
                </div>

                <Input
                  label="Link (Opcional)"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://neolife.com/tema"
                />

                <Input
                  label="Texto do Botão (Opcional)"
                  name="buttonText"
                  value={formData.buttonText}
                  onChange={handleInputChange}
                  placeholder="Saiba Mais"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início (Opcional)
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Fim (Opcional)
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
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
                    {editingBanner ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Banners List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <Card key={banner._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-black">{banner.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">Ordem: {banner.order}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    banner.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {banner.active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <p className="text-sm text-gray-600 mb-4">{banner.description}</p>
                {banner.link && (
                  <p className="text-xs text-gray-500 mb-4">Link: {banner.link}</p>
                )}
                {banner.startDate && (
                  <p className="text-xs text-gray-500 mb-2">
                    Início: {new Date(banner.startDate).toLocaleDateString('pt-PT')}
                  </p>
                )}
                {banner.endDate && (
                  <p className="text-xs text-gray-500 mb-4">
                    Fim: {new Date(banner.endDate).toLocaleDateString('pt-PT')}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(banner)}>
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleDelete(banner._id)}
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

export default function AdminBannersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    }>
      <BannersContent />
    </Suspense>
  );
}