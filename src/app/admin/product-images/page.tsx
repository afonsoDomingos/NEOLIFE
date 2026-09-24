'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { healthSolutionPacks } from '@/data/health-solutions';
import { cellular4Supplements } from '@/data/health-solutions';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface ProductImage {
  _id?: string;
  productId: string;
  productType: 'pack' | 'supplement' | 'shake';
  imageUrl: string;
  altText?: string;
  country?: string;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

function ProductImagesContent() {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState<ProductImage | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    productType: 'pack' as 'pack' | 'supplement' | 'shake',
    imageUrl: '',
    altText: '',
    country: '',
    featured: false,
  });

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const response = await fetch('/api/admin/product-images');
      if (response.ok) {
        const data = await response.json();
        setImages(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = editingImage 
        ? { ...formData, _id: editingImage._id }
        : formData;

      const method = editingImage ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/product-images', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadImages();
        setShowModal(false);
        setEditingImage(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Tem certeza que deseja remover esta imagem?')) return;

    try {
      const response = await fetch(`/api/admin/product-images?_id=${_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleToggleFeatured = async (_id: string, featured: boolean) => {
    try {
      const response = await fetch('/api/admin/product-images', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id, featured }),
      });

      if (response.ok) {
        await loadImages();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      productId: '',
      productType: 'pack',
      imageUrl: '',
      altText: '',
      country: '',
      featured: false,
    });
  };

  const openModal = (image?: ProductImage) => {
    if (image) {
      setEditingImage(image);
      setFormData({
        productId: image.productId,
        productType: image.productType,
        imageUrl: image.imageUrl,
        altText: image.altText || '',
        country: image.country || '',
        featured: image.featured || false,
      });
    } else {
      setEditingImage(null);
      resetForm();
    }
    setShowModal(true);
  };

  const getProductName = (productId: string, productType: string) => {
    if (productType === 'pack') {
      const pack = healthSolutionPacks.find(p => p.id === productId);
      return pack ? pack.titlePt : productId;
    } else if (productType === 'supplement') {
      const supplement = cellular4Supplements.find((s, i) => `supplement-${i}` === productId);
      return supplement ? supplement.name : productId;
    } else if (productType === 'shake') {
      return 'NeolifeShake';
    }
    return productId;
  };

  // Produtos disponíveis para configurar
  const availableProducts = [
    // Packs
    ...healthSolutionPacks.map(pack => ({
      productId: pack.id,
      productType: 'pack' as const,
      name: pack.titlePt,
    })),
    // Suplementos
    ...cellular4Supplements.map((supp, index) => ({
      productId: `supplement-${index}`,
      productType: 'supplement' as const,
      name: supp.name,
    })),
    // Shake
    {
      productId: 'neolife-shake',
      productType: 'shake' as const,
      name: 'NeolifeShake',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        title="Imagens de Produtos"
        showRefresh={true}
        onRefresh={loadImages}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Page-specific toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Configure as imagens dos produtos. As imagens aparecerão nos cards dos produtos na página de saúde.
          </p>
          <Button onClick={() => openModal()} className="bg-emerald-700 hover:bg-emerald-800 text-white">
            + Adicionar Imagem
          </Button>
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                      {image.productType.toUpperCase()}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2">
                      {getProductName(image.productId, image.productType)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {image.productId}
                    </p>
                  </div>
                  {image.featured && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                      ⭐ Destaque
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.altText || getProductName(image.productId, image.productType)}
                    className="w-full h-full object-cover"
                  />
                </div>
                {image.altText && (
                  <p className="text-xs text-gray-600 italic mb-4">
                    "{image.altText}"
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(image)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleFeatured(image._id!, !image.featured)}
                    className={image.featured ? 'bg-amber-50 border-amber-300 text-amber-800' : ''}
                  >
                    {image.featured ? '★' : '☆'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(image._id!)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Apagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {images.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500">
                Nenhuma imagem configurada ainda. Clique em "Adicionar Imagem" para começar.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingImage ? 'Editar Imagem' : 'Adicionar Imagem'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowModal(false);
                    setEditingImage(null);
                    resetForm();
                  }}
                >
                  X
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Produto
                  </label>
                  <select
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione um produto</option>
                    {availableProducts.map((product) => (
                      <option key={product.productId} value={product.productId}>
                        {product.name} ({product.productType})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Produto
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="pack">Pack</option>
                    <option value="supplement">Suplemento</option>
                    <option value="shake">Shake</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Texto Alternativo (Alt)
                  </label>
                  <Input
                    value={formData.altText}
                    onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                    placeholder="Descrição da imagem para acessibilidade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País (Opcional)
                  </label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="mz-pt, za, etc."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Imagem em destaque
                  </label>
                </div>

                {formData.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowModal(false);
                      setEditingImage(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    {editingImage ? 'Atualizar' : 'Adicionar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function ProductImagesPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>}>
      <ProductImagesContent />
    </React.Suspense>
  );
}