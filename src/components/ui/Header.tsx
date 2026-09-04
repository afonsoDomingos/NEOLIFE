'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="text-xl sm:text-2xl font-bold text-black">
              NeoLife
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 sm:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-black transition-colors text-sm sm:text-base">
              Início
            </Link>
            <Link href="/#temas" className="text-gray-700 hover:text-black transition-colors text-sm sm:text-base">
              Temas
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link href="/admin" className="text-xs sm:text-sm text-gray-600 hover:text-black transition-colors">
              Admin
            </Link>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                href="/#temas" 
                className="text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Temas
              </Link>
              <Link 
                href="/admin" 
                className="text-gray-700 hover:text-black transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};