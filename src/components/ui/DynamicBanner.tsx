'use client';

import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import Link from 'next/link';

interface Banner {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  buttonText?: string;
  active: boolean;
  order: number;
}

const defaultBanners: Banner[] = [
  {
    _id: 'default-banner-01',
    title: 'Construa o Seu Próprio Negócio com a NeoLife em África',
    description: 'Descubra como transformar a sua saúde, bem-estar e conquistar a sua independência financeira trabalhando a partir de qualquer lugar.',
    image: '/banner01.jpg',
    link: '/#temas',
    buttonText: 'Quero Saber Mais',
    active: true,
    order: 1,
  }
];

export const DynamicBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setBanners(data);
        }
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  };

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 6000); // Change banner every 6 seconds

      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const banner = banners[currentBanner] || defaultBanners[0];

  return (
    <div className="relative w-full h-[440px] sm:h-[500px] md:h-[560px] overflow-hidden bg-gray-950">
      {/* Background Image with Smooth Transition */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
        style={{ backgroundImage: `url(${banner.image})` }}
      >
        {/* Multilayer gradient for perfect text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
      </div>

      {/* Banner Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            NeoLife África • Destaque
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight drop-shadow-md">
            {banner.title}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {banner.description}
          </p>

          <div className="flex justify-center">
            <Link href={banner.link || '/#temas'}>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/50 text-base font-semibold px-8 py-3.5 rounded-lg transition-all transform hover:-translate-y-0.5">
                {banner.buttonText || 'Quero Saber Mais'}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Dots (Only if multiple banners) */}
      {banners.length > 1 && (
        <div className="absolute z-20 bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentBanner 
                  ? 'w-7 h-2.5 bg-emerald-400' 
                  : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Ir para o banner ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows (Only if multiple banners) */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)}
            className="absolute z-20 left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-emerald-600 text-white p-3 rounded-full backdrop-blur-md border border-white/15 transition-colors shadow-lg"
            aria-label="Banner anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentBanner((prev) => (prev + 1) % banners.length)}
            className="absolute z-20 right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-emerald-600 text-white p-3 rounded-full backdrop-blur-md border border-white/15 transition-colors shadow-lg"
            aria-label="Próximo banner"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};