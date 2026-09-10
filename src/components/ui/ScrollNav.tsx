'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollNav() {
  const pathname = usePathname();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNearTop, setIsNearTop] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  // Do not render on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;

      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(Math.round(progress));
      }

      setIsNearTop(scrollTop < 120);
      setIsNearBottom(scrollTop + window.innerHeight >= document.documentElement.scrollHeight - 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div
      aria-label="Navegação rápida de página"
      className="fixed left-4 sm:left-6 bottom-6 z-40 flex flex-col items-center gap-1.5 bg-white/95 backdrop-blur-md border border-gray-200/80 shadow-lg hover:shadow-xl rounded-full p-1.5 transition-all duration-300 group"
    >
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        title="Subir para o topo"
        aria-label="Subir para o topo"
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
          isNearTop
            ? 'text-gray-300 hover:text-gray-500 hover:bg-gray-100/60'
            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white shadow-sm active:scale-95'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* Progress pill indicator */}
      <div
        title={`Posição na página: ${scrollProgress}%`}
        className="text-[10px] font-bold text-gray-500 select-none py-0.5 px-1 tracking-tighter"
      >
        {scrollProgress}%
      </div>

      {/* Scroll to Bottom */}
      <button
        onClick={scrollToBottom}
        title="Descer para o rodapé"
        aria-label="Descer para o rodapé"
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
          isNearBottom
            ? 'text-gray-300 hover:text-gray-500 hover:bg-gray-100/60'
            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white shadow-sm active:scale-95'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
