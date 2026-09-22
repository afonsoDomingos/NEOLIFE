'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { healthSolutionPacks } from '@/data/health-solutions';
import { cellular4Supplements } from '@/data/health-solutions';

interface ProductLink {
  _id?: string;
  productId: string;
  productType: 'pack' | 'supplement' | 'shake';
  purchaseUrl: string;
  available: boolean;
  customMessage?: string;
  country?: string;
}

export default function ProductLinksPage() {
  const [links, setLinks] = useState<ProductLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<ProductLink | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const response = await fetch('/api/admin/product-links');
      if (response.ok) {
        const data = await response.json();
        setLinks(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (linkData: ProductLink) => {
    try {
      const response = await fetch('/api/admin/product-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkData),
      });

      if (response.ok) {
        await loadLinks();
        setShowModal(false);
        setEditingLink(null);
      }
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Tem certeza que deseja remover este link de compra?')) return;

    try {
      const response = await fetch(`/api/admin/product-links?productId=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadLinks();
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const handleToggleAvailability = async (productId: string, available: boolean) => {
    try {
      const response = await fetch('/api/admin/product-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, available }),
      });

      if (response.ok) {
        await loadLinks();
      }
    } catch (error) {
      console.error('Error toggling availability:', error);
    }
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Links de Compra de Produtos
            </h1>
            <p className="text-gray-600">
              Configure os links de compra para cada produto. Quando não configurado, o produto aparecerá como "não disponível".
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingLink({
                productId: '',
                productType: 'pack',
                purchaseUrl: '',
                available: true,
              });
              setShowModal(true);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            + Adicionar Link
          </Button>
        </div>

        {/* Links Configurados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {links.map((link) => (
            <Card key={link.productId} className="border-emerald-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      {link.productType}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">
                      {getProductName(link.productId, link.productType)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 font-mono">
                      {link.productId}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAvailability(link.productId, !link.available)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        link.available
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={link.available ? 'Disponível' : 'Indisponível'}
                    >
                      {link.available ? 'Sim' : 'Não'}
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700">URL de Compra:</label>
                    <p className="text-sm text-gray-900 break-all font-mono mt-1">
                      {link.purchaseUrl}
                    </p>
                  </div>
                  {link.customMessage && (
                    <div>
                      <label className="text-xs font-semibold text-gray-700">Mensagem Personalizada:</label>
                      <p className="text-sm text-gray-600 mt-1 italic">
                        {link.customMessage}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingLink(link);
                        setShowModal(true);
                      }}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(link.productId)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Produtos Não Configurados */}
        <Card className="border-gray-300">
          <CardHeader>
            <h2 className="text-xl font-bold text-gray-900">
              Produtos Sem Link Configurado
            </h2>
            <p className="text-sm text-gray-600">
              Estes produtos aparecerão como "não disponível" para os usuários
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableProducts
                .filter(prod => !links.find(link => link.productId === prod.productId))
                .map((prod) => (
                  <div
                    key={prod.productId}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-gray-200 text-gray-700">
                          {prod.productType}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 mt-2">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1 font-mono">
                          {prod.productId}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingLink({
                            productId: prod.productId,
                            productType: prod.productType,
                            purchaseUrl: '',
                            available: true,
                          });
                          setShowModal(true);
                        }}
                      >
                        Configurar
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal de Edição/Criação */}
      {showModal && editingLink && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingLink._id ? 'Editar Link' : 'Adicionar Link'}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSave(editingLink);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Produto
                </label>
                <select
                  value={editingLink.productId}
                  onChange={(e) => {
                    const selected = availableProducts.find(p => p.productId === e.target.value);
                    if (selected) {
                      setEditingLink({
                        ...editingLink,
                        productId: selected.productId,
                        productType: selected.productType,
                      });
                    }
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  disabled={!!editingLink._id}
                >
                  {availableProducts.map((prod) => (
                    <option key={prod.productId} value={prod.productId}>
                      {prod.name} ({prod.productId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  URL de Compra
                </label>
                <input
                  type="url"
                  value={editingLink.purchaseUrl}
                  onChange={(e) => setEditingLink({ ...editingLink, purchaseUrl: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="https://exemplo.com/comprar"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Disponível
                </label>
                <select
                  value={editingLink.available.toString()}
                  onChange={(e) => setEditingLink({ ...editingLink, available: e.target.value === 'true' })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Mensagem Personalizada (quando indisponível)
                </label>
                <textarea
                  value={editingLink.customMessage || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, customMessage: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  rows={2}
                  placeholder="Produto temporariamente indisponível. Contacte-nos para mais informações."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingLink(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Salvar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}