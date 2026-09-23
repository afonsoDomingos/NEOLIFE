'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface AdminHeaderProps {
  title?: string;
  showRefresh?: boolean;
  onRefresh?: () => void;
  showWebsiteLink?: boolean;
}

export function AdminHeader({ 
  title = 'Painel de Administração',
  showRefresh = false,
  onRefresh,
  showWebsiteLink = true,
}: AdminHeaderProps) {
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" title="Voltar ao Dashboard" className="flex items-center gap-2">
              <img
                src="/logo-neolife.png"
                alt="NeoLife"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-700 font-semibold text-sm">{title}</span>
          </div>
          <div className="flex items-center gap-2.5">
            {showWebsiteLink && (
              <Link
                href="/"
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-semibold transition-colors"
                title="Abrir o site público"
              >
                <span>Ver Website</span>
              </Link>
            )}
            {showRefresh && onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="text-xs flex items-center gap-1.5 text-gray-600 hover:text-black font-medium"
                title="Recarregar dados"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Atualizar
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
