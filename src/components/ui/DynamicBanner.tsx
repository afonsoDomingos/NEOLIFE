'use client';

import React, { useEffect, useState, useRef } from 'react';
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
  },
  {
    _id: 'default-banner-02',
    title: 'Saúde, Vitalidade e Liberdade Financeira',
    description: 'Junte-se à família NeoLife e descubra o poder da nutrição celular de alta qualidade científica, ao lado da mentoria de José e Ofélia Machado.',
    image: '/banneroficial.png',
    link: '/oportunidade',
    buttonText: 'Conhecer a Oportunidade',
    active: true,
    order: 2,
  }
];

export const DynamicBanner: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>(defaultBanners);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const prevBanner = useRef(0);

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
        setCurrentBanner((prev) => {
          prevBanner.current = prev;
          return (prev + 1) % banners.length;
        });
        setAnimKey((k) => k + 1);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const goTo = (index: number) => {
    prevBanner.current = currentBanner;
    setCurrentBanner(index);
    setAnimKey((k) => k + 1);
  };

  const banner = banners[currentBanner] || defaultBanners[0];

  return (
    <>
      <style>{`
        @keyframes bannerFadeIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDownFade {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glowPulse {
          0%, 100% { text-shadow: 0 2px 8px rgba(0,0,0,0.6); }
          50%       { text-shadow: 0 2px 12px rgba(0,0,0,0.7); }
        }
        @keyframes floatUp {
          0%   { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes btnSlide {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .banner-bg {
          animation: bannerFadeIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .banner-tag {
          animation: slideDownFade 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
        }
        .banner-title {
          animation: slideUpFade 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both,
                     glowPulse 3.5s ease-in-out 1s infinite;
        }
        .banner-desc {
          animation: floatUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both;
        }
        .banner-btn {
          animation: btnSlide 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.65s both;
        }
        .shimmer-text {
          color: #ffffff;
          animation: slideUpFade 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
          text-shadow: 0 2px 12px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
        }
        .shimmer-text:hover {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #ffffff 30%,
            #6ee7b7 50%,
            #ffffff 70%,
            #ffffff 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 1.2s linear forwards;
        }
        .word-reveal span {
          display: inline-block;
          opacity: 0;
          animation: slideUpFade 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

      <div className="relative w-full h-[440px] sm:h-[500px] md:h-[560px] overflow-hidden bg-gray-950">

        {/* Background Image with Smooth Transition */}
        <div
          key={`bg-${animKey}`}
          className="absolute inset-0 bg-cover bg-center banner-bg"
          style={{ backgroundImage: `url(${banner.image})` }}
        >
          {/* Multilayer gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
          {/* Left-side vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
        </div>

        {/* Animated particles (decorative dots) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-emerald-400/20 blur-sm"
              style={{
                width: `${8 + i * 5}px`,
                height: `${8 + i * 5}px`,
                top: `${15 + i * 13}%`,
                left: `${5 + i * 14}%`,
                animation: `floatUp ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* Thin emerald line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent z-10" />

        {/* Banner Content */}
        <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div key={`content-${animKey}`} className="max-w-4xl mx-auto text-center text-white">

            {/* Tag */}
            <div className="banner-tag inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              NeoLife África • Destaque
            </div>

            {/* Title with shimmer gradient effect */}
            <h2 className="shimmer-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
              {banner.title}
            </h2>

            {/* Description with fade-up */}
            <p className="banner-desc text-base sm:text-lg md:text-xl text-gray-300 mb-9 max-w-2xl mx-auto leading-relaxed drop-shadow">
              {banner.description}
            </p>

            {/* CTA Button */}
            <div className="banner-btn flex justify-center">
              <Link href={banner.link || '/#temas'}>
                <Button
                  size="lg"
                  className="relative group overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/60 text-base font-semibold px-8 py-3.5 rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-emerald-400/30"
                >
                  {/* Button shine sweep */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                  <span className="relative">{banner.buttonText || 'Quero Saber Mais'}</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        {banners.length > 1 && (
          <div className="absolute z-20 bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
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

        {/* Navigation Arrows */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => goTo((currentBanner - 1 + banners.length) % banners.length)}
              className="absolute z-20 left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-emerald-600 text-white p-3 rounded-full backdrop-blur-md border border-white/15 transition-all shadow-lg hover:scale-110"
              aria-label="Banner anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo((currentBanner + 1) % banners.length)}
              className="absolute z-20 right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-emerald-600 text-white p-3 rounded-full backdrop-blur-md border border-white/15 transition-all shadow-lg hover:scale-110"
              aria-label="Próximo banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </>
  );
};