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
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo-neolife.png"
              alt="NeoLife"
              className="h-10 w-auto object-contain rounded-md"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 leading-none group-hover:text-emerald-700 transition-colors">
                Neo<span className="text-emerald-600">Life</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600 mt-0.5">
                África
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 sm:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm sm:text-base">
              Início
            </Link>
            <Link href="/#temas" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors text-sm sm:text-base">
              Temas de Interesse
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              href="/admin" 
              className="text-xs sm:text-sm text-gray-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-md hover:bg-emerald-50 border border-transparent hover:border-emerald-200"
            >
              Área Admin
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
                href="/admin" 
                className="text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Área Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};