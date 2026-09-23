'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import Link from 'next/link';
import { healthSolutionPacks, cellular4Supplements } from '@/data/health-solutions';

interface HealthProductImage {
  id: string;
  name: string;
  image: string;
  type: 'pack' | 'supplement';
}

function HealthProductsContent() {
  const [productImages, setProductImages] = useState<HealthProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<HealthProductImage | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    image: '',
    type: 'pack' as 'pack' | 'supplement',
  });

  useEffect(() => {
    loadProductImages();
  }, []);

  const loadProductImages = async () => {
    try {
      const response = await fetch('/api/admin/health-products');
      if (response.ok) {
        const data = await response.json();
        setProductImages(data);
      } else {
        // Initialize with default data from health-solutions.ts
        const defaultImages: HealthProductImage[] = [
          ...healthSolutionPacks.map(pack => ({
            id: pack.id,
            name: pack.titlePt,
            image: pack.image || '',
            type: 'pack' as const,
          })),
          ...cellular4Supplements.map((supp, index) => ({
            id: `supplement-${index}`,
            name: supp.name,
            image: supp.image || '',
            type: 'supplement' as const,
          })),
        ];
        setProductImages(defaultImages);
      }
    } catch (error) {
      console.error('Error loading product images:', error);
      // Initialize with default data
      const defaultImages: HealthProductImage[] = [
        ...healthSolutionPacks.map(pack => ({
          id: pack.id,
          name: pack.titlePt,
          image: pack.image || '',
          type: 'pack' as const,
        })),
        ...cellular4Supplements.map((supp, index) => ({
          id: `supplement-${index}`,
          name: supp.name,
          image: supp.image || '',
          type: 'supplement' as const,
        })),
      ];
      setProductImages(defaultImages);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageUrl: string, publicId: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProduct 
        ? `/api/admin/health-products/${editingProduct.id}`
        : '/api/admin/health-products';
      
      const method = editingProduct ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        loadProductImages();
        setShowAddForm(false);
        setEditingProduct(null);
        setFormData({
          id: '',
          name: '',
          image: '',
          type: 'pack',
        });
      }
    } catch (error) {
      console.error('Error saving product image:', error);
    }
  };

  const handleEdit = (product: HealthProductImage) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      image: product.image,
      type: product.type,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem a certeza que deseja remover a imagem deste produto?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/health-products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadProductImages();
      }
    } catch (error) {
      console.error('Error deleting product image:', error);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      image: '',
      type: 'pack',
    });
  };

  const filteredProducts = productImages.filter(p => p.type === 'pack');
  const filteredSupplements = productImages.filter(p => p.type === 'supplement');

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
              <h1 className="text-xl font-bold text-black">Gestão de Imagens de Produtos de Saúde</h1>
            </div>
            <Button onClick={() => setShowAddForm(true)}>
              + Adicionar Imagem
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
                {editingProduct ? 'Editar Imagem de Produto' : 'Adicionar Imagem de Produto'}
              </h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Produto
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="pack">Pacote de Saúde</option>
                    <option value="supplement">Suplemento Celular</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Produto
                  </label>
                  <select
                    name="id"
                    value={formData.id}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      let productName = '';
                      
                      if (formData.type === 'pack') {
                        const product = healthSolutionPacks.find(p => p.id === selectedId);
                        productName = product?.titlePt || '';
                      } else {
                        const index = parseInt(selectedId.split('-')[1]);
                        const product = cellular4Supplements[index];
                        productName = product?.name || '';
                      }
                      
                      setFormData(prev => ({
                        ...prev,
                        id: selectedId,
                        name: productName,
                      }));
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {formData.type === 'pack' ? (
                      healthSolutionPacks.map(pack => (
                        <option key={pack.id} value={pack.id}>
                          {pack.titlePt}
                        </option>
                      ))
                    ) : (
                      cellular4Supplements.map((supp, index) => (
                        <option key={index} value={`supplement-${index}`}>
                          {supp.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <Input
                  label="Nome do Produto"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem do Produto
                  </label>
                  <ImageUpload
                    onUpload={handleImageUpload}
                    currentImage={formData.image}
                    folder="neolife/health-products"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit">
                    {editingProduct ? 'Atualizar' : 'Adicionar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Products List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Packs Section */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">Pacotes de Saúde</h2>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500">Nenhuma imagem de pacote cadastrada ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <h3 className="font-semibold text-black">{product.name}</h3>
                        <span className="text-xs text-gray-500">Pacote</span>
                      </CardHeader>
                      <CardContent>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                            <p className="text-gray-400 text-sm">Sem imagem</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            Editar
                          </Button>
                          {product.image && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Supplements Section */}
            <div>
              <h2 className="text-xl font-bold text-black mb-4">Suplementos Celulares</h2>
              {filteredSupplements.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500">Nenhuma imagem de suplemento cadastrada ainda.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSupplements.map((product) => (
                    <Card key={product.id}>
                      <CardHeader>
                        <h3 className="font-semibold text-black">{product.name}</h3>
                        <span className="text-xs text-gray-500">Suplemento</span>
                      </CardHeader>
                      <CardContent>
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-40 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                            <p className="text-gray-400 text-sm">Sem imagem</p>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                            Editar
                          </Button>
                          {product.image && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleDelete(product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminHealthProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    }>
      <HealthProductsContent />
    </Suspense>
  );
}