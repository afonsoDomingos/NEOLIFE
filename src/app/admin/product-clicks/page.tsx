'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface ClickStats {
  totalClicks: number;
  clicksByProduct: Record<string, number>;
  clicksByType: Record<string, number>;
  clicksByCountry: Record<string, number>;
  clicksBySource: Record<string, number>;
  dailyTrend: Array<{ date: string; count: number }>;
  recentClicks: Array<{
    productId: string;
    productType: string;
    productName: string;
    timestamp: string;
    country?: string;
    source?: string;
    campaign?: string;
  }>;
}

function ProductClicksContent() {
  const [stats, setStats] = useState<ClickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [period, selectedProduct]);

  const loadStats = async () => {
    try {
      const params = new URLSearchParams();
      params.set('period', period);
      if (selectedProduct) params.set('productId', selectedProduct);

      const response = await fetch(`/api/admin/product-clicks?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading click stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!stats) return;

    const csvContent = [
      ['Data', 'Produto', 'Tipo', 'País', 'Fonte', 'Campanha'],
      ...stats.recentClicks.map(click => [
        new Date(click.timestamp).toLocaleString('pt-PT'),
        click.productName,
        click.productType,
        click.country || 'N/A',
        click.source || 'N/A',
        click.campaign || 'N/A',
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `product-clicks-${period}.csv`;
    link.click();
  };

  const maxDailyCount = Math.max(...(stats?.dailyTrend?.map(d => d.count) || [1]), 1);

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
              <h1 className="text-xl font-bold text-black">Estatísticas de Cliques</h1>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Últimos 30 dias</option>
                <option value="90d">Últimos 90 dias</option>
                <option value="all">Todo o período</option>
              </select>
              <Button onClick={handleExport} variant="outline" size="sm">
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : !stats ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
            <p className="text-gray-500">Nenhum dado disponível</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                <CardHeader className="pb-2">
                  <p className="text-sm font-medium text-gray-600">Total de Cliques</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalClicks}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-500">No período selecionado</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                  <p className="text-sm font-medium text-gray-600">Pacotes</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.clicksByType['pack'] || 0}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-500">Cliques em pacotes de saúde</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 shadow-sm">
                <CardHeader className="pb-2">
                  <p className="text-sm font-medium text-gray-600">Suplementos</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.clicksByType['supplement'] || 0}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-500">Cliques em suplementos</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500 shadow-sm">
                <CardHeader className="pb-2">
                  <p className="text-sm font-medium text-gray-600">Produtos Únicos</p>
                  <p className="text-3xl font-bold text-gray-900">{Object.keys(stats.clicksByProduct).length}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-500">Produtos com cliques</p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Trend Chart */}
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Tendência Diária</h3>
              </CardHeader>
              <CardContent>
                {stats.dailyTrend.length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
                    Sem dados disponíveis
                  </div>
                ) : (
                  <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-gray-100">
                    {stats.dailyTrend.map((day, index) => {
                      const heightPct = Math.max((day.count / maxDailyCount) * 100, day.count > 0 ? 15 : 4);
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group relative">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-10">
                            {day.count} cliques
                          </div>
                          <div
                            className="w-full bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-t"
                            style={{ height: `${heightPct}%` }}
                          />
                          <div className="text-[10px] text-gray-500 text-center">
                            {new Date(day.date).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Products */}
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Produtos Mais Clicados</h3>
                </CardHeader>
                <CardContent>
                  {Object.entries(stats.clicksByProduct)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([productId, count], index) => (
                      <div key={productId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900 w-6">#{index + 1}</span>
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">{productId}</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{count}</span>
                      </div>
                    ))}
                </CardContent>
              </Card>

              {/* By Country */}
              <Card className="shadow-sm">
                <CardHeader>
                  <h3 className="font-semibold text-gray-900">Cliques por País</h3>
                </CardHeader>
                <CardContent>
                  {Object.keys(stats.clicksByCountry).length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">Sem dados de país</p>
                  ) : (
                    Object.entries(stats.clicksByCountry)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 10)
                      .map(([country, count], index) => (
                        <div key={country} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900 w-6">#{index + 1}</span>
                            <span className="text-sm text-gray-700">{country}</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">{count}</span>
                        </div>
                      ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Clicks */}
            <Card className="shadow-sm">
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Cliques Recentes</h3>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Data</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Produto</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Tipo</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">País</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Fonte</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentClicks.slice(0, 20).map((click, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-3 text-gray-600">
                            {new Date(click.timestamp).toLocaleString('pt-PT')}
                          </td>
                          <td className="py-2 px-3 text-gray-900 font-medium">
                            {click.productName}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              click.productType === 'pack' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {click.productType === 'pack' ? 'Pacote' : 'Suplemento'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-gray-600">{click.country || 'N/A'}</td>
                          <td className="py-2 px-3 text-gray-600">{click.source || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductClicksPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    }>
      <ProductClicksContent />
    </Suspense>
  );
}