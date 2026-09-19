'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer' | 'compact';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'footer') {
    return (
      <div className={`inline-flex items-center gap-1.5 p-1 rounded-xl bg-gray-800 border border-gray-700 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('pt')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            language === 'pt'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Mudar para Português"
        >
          <span className="text-sm leading-none">🇵🇹</span>
          <span>PT</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            language === 'en'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
          aria-label="Switch to English"
        >
          <span className="text-sm leading-none">🇬🇧</span>
          <span>EN</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-gray-100/90 border border-gray-200/80 shadow-inner ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage('pt')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === 'pt'
            ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100'
            : 'text-gray-500 hover:text-gray-800'
        }`}
        title="Português"
      >
        <span className="text-sm leading-none">🇵🇹</span>
        <span>PT</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
          language === 'en'
            ? 'bg-white text-emerald-800 shadow-sm border border-emerald-100'
            : 'text-gray-500 hover:text-gray-800'
        }`}
        title="English"
      >
        <span className="text-sm leading-none">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};
