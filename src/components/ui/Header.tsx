'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { LanguageSelector } from '@/components/ui/LanguageSelector';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { totalItemsCount } = useSelection();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with uploaded logo-neolife */}
          <Link href="/" className="flex items-center group">
            <img
              src="/logo-neolife.png"
              alt="NeoLife África"
              className="h-10 sm:h-11 w-auto object-contain"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm">
              {t.nav.home}
            </Link>
            <Link href="/saude" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm">
              {t.nav.health}
            </Link>
            <Link href="/business" className="text-emerald-700 hover:text-emerald-600 font-semibold transition-colors text-sm px-2.5 py-1 rounded-lg hover:bg-emerald-50">
              {t.nav.business}
            </Link>
            <Link href="/experiencias" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm">
              {t.nav.experiences}
            </Link>
            <Link href="/#videos" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm">
              {t.nav.videos}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Selection Cart Badge */}
            {totalItemsCount > 0 && (
              <Link
                href="/formulario?origem=header"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-emerald-100 text-emerald-950 border border-emerald-300 hover:bg-emerald-200 transition-all shadow-xs"
                title="Ver Itens Selecionados"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">Seleção</span>
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-[11px] font-black flex items-center justify-center">
                  {totalItemsCount}
                </span>
              </Link>
            )}

            {/* Language Switcher */}
            <LanguageSelector />

            <Link
              href="/membro/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs shadow-emerald-600/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7 0 3.75 3.75 0 017 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>{t.nav.membersArea}</span>
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-emerald-600 transition-colors"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link 
                href="/saude" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.health}
              </Link>
              <Link 
                href="/business" 
                className="text-emerald-700 font-semibold hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors border border-emerald-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.business}
              </Link>
              <Link 
                href="/experiencias" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.experiences}
              </Link>
              <Link 
                href="/#videos" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.videos}
              </Link>
              <Link 
                href="/membro/login" 
                className="flex items-center gap-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors font-semibold border border-emerald-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7 0 3.75 3.75 0 017 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>{t.nav.membersArea}</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};