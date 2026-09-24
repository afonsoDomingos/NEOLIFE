'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SlideUpText, WordByWordText } from '@/components/ui/AnimatedText';
import Link from 'next/link';
import { getCountryById } from '@/data/countries';
import { getThemeBySlug } from '@/data/themes';
import { AdminAIAssistant } from '@/components/admin/AdminAIAssistant';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DailyLeadsChart } from '@/components/admin/charts/DailyLeadsChart';
import { LeadsByCountryChart } from '@/components/admin/charts/LeadsByCountryChart';
import { LeadStatusChart } from '@/components/admin/charts/LeadStatusChart';
import { LeadsByPillarChart } from '@/components/admin/charts/LeadsByPillarChart';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    loadStats();
    loadRecentLeads();
    loadActivities();
  }, []);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setRecentLeads(Array.isArray(data) ? data.slice(0, 5) : []);
      }
    } catch (error) {
      console.error('Error loading recent leads:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const loadActivities = async () => {
    try {
      const response = await fetch('/api/admin/activities?limit=5&hours=24');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
        
        // Show notification if there are new activities
        if (data.activities && data.activities.length > 0) {
          setNotificationCount(data.activities.length);
          setShowNotification(true);
          
          // Auto-hide after 5 seconds
          setTimeout(() => {
            setShowNotification(false);
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoadingActivities(false);
    }
  };



  const totalLeads = stats?.total || 0;
  const dailyTrend = stats?.dailyTrend || [];
  const maxDailyCount = Math.max(...dailyTrend.map((d: any) => d.count), 1);

  const countryEntries = Object.entries(stats?.byCountry || {}) as [string, number][];
  const themeEntries = Object.entries(stats?.byTheme || {}) as [string, number][];
  const statusEntries: { key: string; label: string; count: number; color: string; bg: string }[] = [
    { key: 'novo', label: 'Novo', count: stats?.byStatus?.novo || 0, color: 'text-blue-700', bg: 'bg-blue-500' },
    { key: 'contactado', label: 'Contactado', count: stats?.byStatus?.contactado || 0, color: 'text-yellow-700', bg: 'bg-yellow-500' },
    { key: 'acompanhamento', label: 'Acompanhamento', count: stats?.byStatus?.acompanhamento || 0, color: 'text-purple-700', bg: 'bg-purple-500' },
    { key: 'interessado', label: 'Interessado', count: stats?.byStatus?.interessado || 0, color: 'text-emerald-700', bg: 'bg-emerald-500' },
    { key: 'convertido', label: 'Convertido', count: stats?.byStatus?.convertido || 0, color: 'text-green-700', bg: 'bg-green-600' },
    { key: 'nao_interessado', label: 'Não Interessado', count: stats?.byStatus?.nao_interessado || 0, color: 'text-red-700', bg: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        showRefresh={true}
        onRefresh={() => {
          setLoading(true);
          setLoadingLeads(true);
          setLoadingActivities(true);
          loadStats();
          loadRecentLeads();
          loadActivities();
        }}
      />

      {/* Temporary Notification Card */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 border-0 shadow-lg">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">
                  {notificationCount} nova{notificationCount !== 1 ? 's' : ''} atividade{notificationCount !== 1 ? 's' : ''}
                </p>
                <p className="text-white/80 text-xs">
                  Últimas 24 horas
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-emerald-500 shadow-sm">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-gray-600">Total de Leads</p>
              {loading ? (
                <div className="h-9 w-20 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats?.total || 0}</p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-500">Contactos registados no sistema</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 shadow-sm">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-gray-600">Leads Hoje</p>
              {loading ? (
                <div className="h-9 w-14 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{stats?.today || 0}</p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-500">Submetidos nas últimas 24h</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 shadow-sm">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-gray-600">Países Ativos</p>
              {loading ? (
                <div className="h-9 w-14 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.activeCountries ?? 4}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-500">Mercados configurados</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 shadow-sm">
            <CardHeader className="pb-2">
              <p className="text-sm font-medium text-gray-600">Temas Ativos</p>
              {loading ? (
                <div className="h-9 w-14 bg-gray-200 animate-pulse rounded mt-1" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.activeThemes ?? 6}
                </p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-gray-500">Cards de interesse publicados</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">
            <WordByWordText 
              text="Dashboard Visual"
              speed={150}
            />
          </h2>
          
          {/* Daily Leads Chart - Full Width */}
          <Card className="mb-6">
            <CardHeader>
              <p className="text-sm font-medium text-gray-600">Leads Diários (Últimos 30 dias)</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg" />
              ) : (
                <DailyLeadsChart data={dailyTrend} />
              )}
            </CardContent>
          </Card>

          {/* Country and Status Charts - Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <p className="text-sm font-medium text-gray-600">Leads por País</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg" />
                ) : (
                  <LeadsByCountryChart 
                    data={countryEntries.map(([country, count]) => ({
                      country: getCountryById(country)?.namePt || country,
                      count
                    }))} 
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-sm font-medium text-gray-600">Status dos Leads</p>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg" />
                ) : (
                  <LeadStatusChart 
                    data={statusEntries.map(({ key, count }) => ({
                      status: key,
                      count
                    }))} 
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pillar Chart - Full Width */}
          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-gray-600">Interesse por Pilar</p>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] bg-gray-200 animate-pulse rounded-lg" />
              ) : (
                <LeadsByPillarChart 
                  data={themeEntries.map(([theme, count]) => ({
                    pillar: theme,
                    count
                  }))} 
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activities Feed */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">
            <WordByWordText 
              text="Atividades Recentes"
              speed={150}
            />
          </h2>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-600">
                  Últimas 24 horas
                </p>
                {activities.length > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                    {activities.length} nova{activities.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loadingActivities ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">
                    Nenhuma atividade recente nas últimas 24 horas
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        activity.type === 'lead' ? 'bg-emerald-100 text-emerald-700' :
                        activity.type === 'product_image' ? 'bg-purple-100 text-purple-700' :
                        activity.type === 'health_product' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {activity.type === 'lead' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        ) : activity.type === 'product_image' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l4.586-4.586a2 2 0 012.828 0L16 4m-2 0L6.586 9.414a2 2 0 012.828 0L16 14m-2 0L6.586 9.414a2 2 0 012.828 0L4 20m0 0V6a2 2 0 012-2h2a2 2 0 012 2v2" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.timestamp).toLocaleString('pt-PT')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-black mb-4">
            <WordByWordText 
              text="Ações Rápidas"
              speed={150}
            />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <Link href="/admin/leads">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Gerir Leads</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Ver, filtrar e exportar CSV</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/themes">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Gerir Temas</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Criar e editar cards</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/product-links">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-orange-50 text-orange-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Links de Compra</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Configurar URLs de produtos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/product-images">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l4.586-4.586a2 2 0 012.828 0L16 4m-2 0L6.586 9.414a2 2 0 012.828 0L16 14m-2 0L6.586 9.414a2 2 0 012.828 0L4 20m0 0V6a2 2 0 012-2h2a2 2 0 012 2v2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Imagens de Produtos</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Configurar fotos dos produtos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/health-products-manage">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-green-50 text-green-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Gerir Produtos</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Criar, editar e apagar produtos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/health-products">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-pink-50 text-pink-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Imagens de Produtos</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Gerir imagens de saúde</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/product-clicks">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Estatísticas de Cliques</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Analytics de produtos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/videos">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Gerir Vídeos</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Adicionar e editar vídeos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/countries">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Gerir Países</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Configurar países e DDDs</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/banners">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-purple-50 text-purple-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Gerir Banners</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Criar banners do topo</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/members">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Gerir Membros</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Contas de clientes</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/anuncios">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div className="p-2.5 bg-orange-50 text-orange-700 rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                  </div>
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Avisos & Anúncios</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Comunicados aos membros</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/recursos">
              <Card className="hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-start gap-3">
                  <div>
                    <h3 className="font-semibold text-black group-hover:text-emerald-700 transition-colors text-sm">Recursos & Materiais</h3>
                    <p className="text-xs text-gray-500 mt-0.5">PDFs, guias e vídeos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* GRÁFICOS & ANALYTICS SECTION */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-black">
              Gráficos & Estatísticas em Tempo Real
            </h2>
            <span className="text-xs text-gray-500">Atualização automática com base no MongoDB</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Volume de Leads (Últimos 7 Dias) */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Volume de Leads (Últimos 7 Dias)
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    Hoje: {stats?.today || 0}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {dailyTrend.length === 0 ? (
                  <div className="h-44 flex items-center justify-center text-gray-400 text-xs">
                    Sem dados temporais disponíveis
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-gray-100">
                      {dailyTrend.map((day: any) => {
                        const heightPct = Math.max((day.count / maxDailyCount) * 100, day.count > 0 ? 15 : 4);
                        const isToday = day.dayName === 'Hoje';
                        return (
                          <div key={day.date} className="flex-1 flex flex-col items-center gap-2 group relative">
                            {/* Tooltip on hover */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap pointer-events-none z-10">
                              {day.count} {day.count === 1 ? 'lead' : 'leads'} ({day.date})
                            </div>
                            <span className="text-[11px] font-bold text-gray-700">
                              {day.count > 0 ? day.count : ''}
                            </span>
                            <div
                              style={{ height: `${heightPct}%` }}
                              className={`w-full rounded-t-md transition-all duration-500 ${
                                isToday
                                  ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-md shadow-emerald-200'
                                  : day.count > 0
                                  ? 'bg-emerald-500 hover:bg-emerald-600'
                                  : 'bg-gray-100'
                              }`}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between px-2 pt-1">
                      {dailyTrend.map((day: any) => (
                        <div key={day.date} className="flex-1 text-center">
                          <p className={`text-[11px] font-medium ${day.dayName === 'Hoje' ? 'text-emerald-700 font-bold' : 'text-gray-600'}`}>
                            {day.dayName}
                          </p>
                          <p className="text-[10px] text-gray-400">{day.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart 2: Pipeline de Estados (Funil de Vendas) */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Funil de Contactos (Pipeline)
                  </h3>
                  <span className="text-xs text-gray-500">
                    Total: {totalLeads}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {statusEntries.map((st) => {
                  const pct = totalLeads > 0 ? Math.round((st.count / totalLeads) * 100) : 0;
                  return (
                    <div key={st.key} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className={`font-medium ${st.color}`}>{st.label}</span>
                        <span className="font-bold text-gray-700">{st.count} <span className="font-normal text-gray-400">({pct}%)</span></span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className={`h-full ${st.bg} rounded-full transition-all duration-500`}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Chart 3: Distribuição por País */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Leads por País
                </h3>
              </CardHeader>
              <CardContent className="pt-4">
                {countryEntries.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs">
                    Nenhum lead com país registado ainda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {countryEntries.map(([code, count]) => {
                      const c = getCountryById(code);
                      const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                      return (
                        <div key={code} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-gray-800 flex items-center gap-1.5">
                              <span>{c?.name || code.toUpperCase()}</span>
                            </span>
                            <span className="font-bold text-gray-700">{count} <span className="font-normal text-gray-400">({pct}%)</span></span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-blue-500 rounded-full transition-all duration-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chart 4: Distribuição por Tema de Interesse */}
            <Card className="shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Leads por Tema de Interesse
                </h3>
              </CardHeader>
              <CardContent className="pt-4">
                {themeEntries.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs">
                    Nenhum lead por tema registado ainda.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {themeEntries.map(([slug, count]) => {
                      const theme = getThemeBySlug(slug);
                      const title = theme?.title || slug;
                      const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                      return (
                        <div key={slug} className="space-y-1">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-gray-800 truncate max-w-[220px]">
                              {title}
                            </span>
                            <span className="font-bold text-gray-700">{count} <span className="font-normal text-gray-400">({pct}%)</span></span>
                          </div>
                          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${pct}%` }}
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* LEADS RECENTES */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-black">
                Leads Recentes
              </h2>
              <Link href="/admin/leads">
                <Button variant="outline" size="sm">
                  Ver Todos ({totalLeads})
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loadingLeads ? (
              <div className="space-y-3">
                {[1,2,3].map(n => (
                  <div key={n} className="h-10 bg-gray-100 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                <p>Nenhum lead registado ainda.</p>
                <p className="mt-1">Os leads aparecerão aqui após o envio de qualquer formulário.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentLeads.map((lead) => {
                  const country = getCountryById(lead.country);
                  const theme = getThemeBySlug(lead.theme);
                  return (
                    <div key={lead._id} className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {country ? `${country.flag} ${country.name}` : lead.country} • {theme?.title || lead.theme} • {lead.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                          lead.status === 'novo' ? 'bg-blue-100 text-blue-700' :
                          lead.status === 'contactado' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'acompanhamento' ? 'bg-purple-100 text-purple-800' :
                          lead.status === 'interessado' ? 'bg-emerald-100 text-emerald-800' :
                          lead.status === 'convertido' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {lead.status === 'novo' ? 'Novo' :
                           lead.status === 'contactado' ? 'Contactado' :
                           lead.status === 'acompanhamento' ? 'Acompanhamento' :
                           lead.status === 'interessado' ? 'Interessado' :
                           lead.status === 'convertido' ? 'Convertido' :
                           lead.status === 'nao_interessado' ? 'Não Interessado' : lead.status}
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(lead.createdAt).toLocaleDateString('pt-PT')} {new Date(lead.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating AI Assistant */}
      <AdminAIAssistant />
    </div>
  );
}