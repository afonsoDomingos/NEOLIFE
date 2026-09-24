'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { AdminHeader } from '@/components/admin/AdminHeader';

interface HealthProductPack {
  _id?: string;
  id: string;
  slug: string;
  category: 'cell' | 'weight' | 'gender' | 'energy' | 'digest' | 'joints' | 'immunity' | 'kids' | 'other';
  titlePt: string;
  titleEn: string;
  badgePt: string;
  badgeEn: string;
  tagPt: string;
  tagEn: string;
  descPt: string;
  descEn: string;
  productsPt: string[];
  productsEn: string[];
  benefitsPt: string[];
  benefitsEn: string[];
  notePt?: string;
  noteEn?: string;
  featured?: boolean;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CATEGORIES = [
  { value: 'cell', label: 'Nutrição Celular', labelEn: 'Cellular Nutrition' },
  { value: 'weight', label: 'Peso', labelEn: 'Weight' },
  { value: 'gender', label: 'Gênero', labelEn: 'Gender' },
  { value: 'energy', label: 'Energia', labelEn: 'Energy' },
  { value: 'digest', label: 'Digestão', labelEn: 'Digestion' },
  { value: 'joints', label: 'Articulações', labelEn: 'Joints' },
  { value: 'immunity', label: 'Imunidade', labelEn: 'Immunity' },
  { value: 'kids', label: 'Crianças', labelEn: 'Kids' },
  { value: 'other', label: 'Outro', labelEn: 'Other' },
];

function HealthProductsContent() {
  const [products, setProducts] = useState<HealthProductPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<HealthProductPack | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    slug: '',
    category: 'cell' as HealthProductPack['category'],
    titlePt: '',
    titleEn: '',
    badgePt: '',
    badgeEn: '',
    tagPt: '',
    tagEn: '',
    descPt: '',
    descEn: '',
    productsPt: [] as string[],
    productsEn: [] as string[],
    benefitsPt: [] as string[],
    benefitsEn: [] as string[],
    notePt: '',
    noteEn: '',
    featured: false,
    image: '',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('/api/admin/health-products');
      if (response.ok) {
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const payload = editingProduct 
        ? { ...formData, _id: editingProduct._id }
        : formData;

      const method = editingProduct ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/health-products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loadProducts();
        setShowModal(false);
        setEditingProduct(null);
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar produto');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Erro ao salvar produto');
    }
  };

  const handleDelete = async (_id: string) => {
    if (!confirm('Tem certeza que deseja remover este produto?')) return;

    try {
      const response = await fetch(`/api/admin/health-products?_id=${_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadProducts();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleToggleFeatured = async (_id: string, featured: boolean) => {
    try {
      const response = await fetch('/api/admin/health-products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id, featured }),
      });

      if (response.ok) {
        await loadProducts();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      slug: '',
      category: 'cell',
      titlePt: '',
      titleEn: '',
      badgePt: '',
      badgeEn: '',
      tagPt: '',
      tagEn: '',
      descPt: '',
      descEn: '',
      productsPt: [],
      productsEn: [],
      benefitsPt: [],
      benefitsEn: [],
      notePt: '',
      noteEn: '',
      featured: false,
      image: '',
    });
  };

  const openModal = (product?: HealthProductPack) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        id: product.id,
        slug: product.slug,
        category: product.category,
        titlePt: product.titlePt,
        titleEn: product.titleEn,
        badgePt: product.badgePt,
        badgeEn: product.badgeEn,
        tagPt: product.tagPt,
        tagEn: product.tagEn,
        descPt: product.descPt,
        descEn: product.descEn,
        productsPt: product.productsPt,
        productsEn: product.productsEn,
        benefitsPt: product.benefitsPt,
        benefitsEn: product.benefitsEn,
        notePt: product.notePt || '',
        noteEn: product.noteEn || '',
        featured: product.featured || false,
        image: product.image || '',
      });
    } else {
      setEditingProduct(null);
      resetForm();
    }
    setShowModal(true);
  };

  const handleArrayChange = (field: 'productsPt' | 'productsEn' | 'benefitsPt' | 'benefitsEn', value: string) => {
    const items = value.split('\n').filter(item => item.trim() !== '');
    setFormData({ ...formData, [field]: items });
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find(c => c.value === category);
    return cat ? cat.label : category;
  };

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
        title="Gerir Produtos de Saúde"
        showRefresh={true}
        onRefresh={loadProducts}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Page-specific toolbar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Crie, edite e remova produtos de saúde. Os produtos são exibidos na página de saúde.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={async () => {
                const response = await fetch('/api/admin/migrate-health-products', { method: 'POST' });
                const data = await response.json();
                alert(data.message);
                loadProducts();
              }}
            >
              Migrar do Arquivo
            </Button>
            <Button onClick={() => openModal()} className="bg-emerald-700 hover:bg-emerald-800 text-white">
              + Adicionar Produto
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                      {getCategoryLabel(product.category)}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-2">
                      {product.titlePt}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {product.titleEn}
                    </p>
                  </div>
                  {product.featured && (
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
                      ⭐ Destaque
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 line-clamp-2 mb-4">
                  {product.descPt}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openModal(product)}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleFeatured(product._id!, !product.featured)}
                    className={product.featured ? 'bg-amber-50 border-amber-300 text-amber-800' : ''}
                  >
                    {product.featured ? '★' : '☆'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product._id!)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    Apagar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">
                Nenhum produto configurado ainda.
              </p>
              <Button onClick={() => openModal()} className="bg-emerald-700 hover:bg-emerald-800 text-white">
                + Adicionar Produto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingProduct ? 'Editar Produto' : 'Adicionar Produto'}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  X
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ID (único)
                    </label>
                    <Input
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      placeholder="pack-nome-produto"
                      disabled={!!editingProduct}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="nome-produto"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label} ({cat.labelEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Titles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título (PT)
                    </label>
                    <Input
                      value={formData.titlePt}
                      onChange={(e) => setFormData({ ...formData, titlePt: e.target.value })}
                      placeholder="Nome do produto em português"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título (EN)
                    </label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                      placeholder="Product name in English"
                    />
                  </div>
                </div>

                {/* Badges */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge (PT)
                    </label>
                    <Input
                      value={formData.badgePt}
                      onChange={(e) => setFormData({ ...formData, badgePt: e.target.value })}
                      placeholder="Texto do badge"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge (EN)
                    </label>
                    <Input
                      value={formData.badgeEn}
                      onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                      placeholder="Badge text"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tag (PT)
                    </label>
                    <Input
                      value={formData.tagPt}
                      onChange={(e) => setFormData({ ...formData, tagPt: e.target.value })}
                      placeholder="Texto da tag"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tag (EN)
                    </label>
                    <Input
                      value={formData.tagEn}
                      onChange={(e) => setFormData({ ...formData, tagEn: e.target.value })}
                      placeholder="Tag text"
                    />
                  </div>
                </div>

                {/* Descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição (PT)
                    </label>
                    <Textarea
                      value={formData.descPt}
                      onChange={(e) => setFormData({ ...formData, descPt: e.target.value })}
                      placeholder="Descrição do produto em português"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição (EN)
                    </label>
                    <Textarea
                      value={formData.descEn}
                      onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                      placeholder="Product description in English"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Products List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Produtos Incluídos (PT) - um por linha
                    </label>
                    <Textarea
                      value={formData.productsPt.join('\n')}
                      onChange={(e) => handleArrayChange('productsPt', e.target.value)}
                      placeholder="Produto 1&#10;Produto 2&#10;Produto 3"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Products Included (EN) - one per line
                    </label>
                    <Textarea
                      value={formData.productsEn.join('\n')}
                      onChange={(e) => handleArrayChange('productsEn', e.target.value)}
                      placeholder="Product 1&#10;Product 2&#10;Product 3"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefícios (PT) - um por linha
                    </label>
                    <Textarea
                      value={formData.benefitsPt.join('\n')}
                      onChange={(e) => handleArrayChange('benefitsPt', e.target.value)}
                      placeholder="Benefício 1&#10;Benefício 2&#10;Benefício 3"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Benefits (EN) - one per line
                    </label>
                    <Textarea
                      value={formData.benefitsEn.join('\n')}
                      onChange={(e) => handleArrayChange('benefitsEn', e.target.value)}
                      placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nota (PT) - Opcional
                    </label>
                    <Textarea
                      value={formData.notePt}
                      onChange={(e) => setFormData({ ...formData, notePt: e.target.value })}
                      placeholder="Nota adicional em português"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Note (EN) - Optional
                    </label>
                    <Textarea
                      value={formData.noteEn}
                      onChange={(e) => setFormData({ ...formData, noteEn: e.target.value })}
                      placeholder="Additional note in English"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Featured */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Produto em destaque
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    {editingProduct ? 'Atualizar' : 'Adicionar'}
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

export default function HealthProductsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>}>
      <HealthProductsContent />
    </React.Suspense>
  );
}