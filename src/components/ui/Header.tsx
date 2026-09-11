'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <nav className="hidden md:flex items-center space-x-6 sm:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm sm:text-base">
              Início
            </Link>
            <Link href="/#temas" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm sm:text-base">
              Temas
            </Link>
            <Link href="/#videos" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm sm:text-base">
              Vídeos
            </Link>
            <Link
              href="/oportunidade"
              className="text-emerald-700 hover:text-emerald-600 font-semibold transition-colors text-sm sm:text-base border border-emerald-200 hover:border-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-50"
            >
              Oportunidade
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Link
              href="/membro/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm shadow-emerald-600/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7 0 3.75 3.75 0 017 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span>Área de Membros</span>
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
                Início
              </Link>
              <Link 
                href="/#temas" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Temas de Interesse
              </Link>
              <Link 
                href="/#videos" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Vídeos
              </Link>
              <Link
                href="/oportunidade"
                className="text-emerald-700 font-semibold hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors border border-emerald-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Oportunidade de Negócio
              </Link>
              <Link 
                href="/membro/login" 
                className="flex items-center gap-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors font-semibold border border-emerald-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7 0 3.75 3.75 0 017 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span>Área de Membros</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};