'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SlideUpText, WordByWordText } from '@/components/ui/AnimatedText';
import Link from 'next/link';
import { getLeadStats } from '@/lib/db/leads';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
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
              <h1 className="text-xl font-bold text-black">NeoLife Admin</h1>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Dashboard</span>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-gray-600">Total de Leads</p>
              <p className="text-3xl font-bold text-black">{stats?.total || 0}</p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-gray-600">Leads Hoje</p>
              <p className="text-3xl font-bold text-black">{stats?.today || 0}</p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-gray-600">Países</p>
              <p className="text-3xl font-bold text-black">
                {Object.keys(stats?.byCountry || {}).length}
              </p>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <p className="text-sm font-medium text-gray-600">Temas</p>
              <p className="text-3xl font-bold text-black">
                {Object.keys(stats?.byTheme || {}).length}
              </p>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-black mb-4">
            <WordByWordText 
              text="Ações Rápidas"
              speed={150}
            />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/leads">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-black mb-2">Gerir Leads</h3>
                  <p className="text-sm text-gray-600">Ver e gerir todos os leads</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/themes">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-black mb-2">Gerir Temas</h3>
                  <p className="text-sm text-gray-600">Criar e editar temas</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin/countries">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-black mb-2">Gerir Países</h3>
                  <p className="text-sm text-gray-600">Configurar países disponíveis</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Leads */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-black">
                <SlideUpText 
                  text="Leads Recentes"
                  delay={200}
                />
              </h2>
              <Link href="/admin/leads">
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              <p>Funcionalidade em desenvolvimento</p>
              <Link href="/admin/leads">
                <Button variant="outline" className="mt-4">
                  Ver Todos os Leads
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}