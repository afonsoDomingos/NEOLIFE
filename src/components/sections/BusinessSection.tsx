'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';

interface BusinessVideo {
  order: number;
  videoUrl: string;
  title: string;
  active: boolean;
}

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  videoUrl?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, title, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h4 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {title}
          </h4>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="aspect-video w-full bg-black flex items-center justify-center relative">
          {videoUrl ? (
            <iframe
              src={videoUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <h5 className="text-white font-bold text-lg mb-2">Vídeo em Finalização de Gravação</h5>
              <p className="text-gray-400 text-sm mb-6">
                Este vídeo curto gravado pelo José Sarmento Machado está em fase de upload. Entretanto, pode esclarecer todas as dúvidas diretamente connosco no WhatsApp!
              </p>
              <a
                href="https://wa.me/258823056900?text=Olá José e Ofélia, gostaria de saber mais sobre este tópico de negócio da NeoLife"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">
                  Falar Agora no WhatsApp
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BusinessSection: React.FC = () => {
  const { t, language } = useLanguage();
  const isPt = language === 'pt';
  const { toggleBusinessGoal, isBusinessGoalSelected, businessGoals } = useSelection();
  const [activeModal, setActiveModal] = useState<{ title: string; videoUrl?: string } | null>(null);
  const [businessVideos, setBusinessVideos] = useState<BusinessVideo[]>([]);

  const availableGoals = [
    { id: 'extra-income', labelPt: 'Rendimento Extra Sustentável', labelEn: 'Extra Sustainable Income' },
    { id: 'full-time', labelPt: 'Negócio Próprio / Carreira Independente', labelEn: 'Full-Time Independent Business' },
    { id: 'mentorship', labelPt: 'Mentoria Direta com José e Ofélia', labelEn: 'Direct Mentorship with José & Ofélia' },
    { id: 'time-freedom', labelPt: 'Liberdade de Tempo & Horários Flexíveis', labelEn: 'Time Freedom & Flexible Hours' },
    { id: 'global-scale', labelPt: 'Expansão Internacional (50+ Países)', labelEn: 'Global Business (50+ Countries)' },
  ];

  useEffect(() => {
    fetch('/api/videos?category=Business')
      .then((r) => r.json())
      .then((data: BusinessVideo[]) => {
        if (Array.isArray(data)) setBusinessVideos(data);
      })
      .catch(() => {/* silent — placeholder is shown */});
  }, []);

  // Returns the video URL for a given block order (1-based), or undefined for placeholder
  const getVideoUrl = (order: number): string | undefined =>
    businessVideos.find((v) => v.active && v.order === order)?.videoUrl;

  const blocks = [
    {
      id: 'intro',
      number: t.business.blocks.intro.number,
      theme: t.business.blocks.intro.theme,
      text: t.business.blocks.intro.text,
      videoTitle: t.business.blocks.intro.videoTitle,
      cta: t.business.blocks.intro.cta,
      nextAnchor: '#business-block-02',
      badge: 'Fundamentos',
    },
    {
      id: 'model',
      number: t.business.blocks.model.number,
      theme: t.business.blocks.model.theme,
      text: t.business.blocks.model.text,
      videoTitle: t.business.blocks.model.videoTitle,
      cta: t.business.blocks.model.cta,
      nextAnchor: '#business-block-03',
      badge: 'Funcionamento',
    },
    {
      id: 'mentorship',
      number: t.business.blocks.mentorship.number,
      theme: t.business.blocks.mentorship.theme,
      text: t.business.blocks.mentorship.text,
      videoTitle: t.business.blocks.mentorship.videoTitle,
      cta: t.business.blocks.mentorship.cta,
      nextAnchor: '#business-block-04',
      badge: 'Acompanhamento',
    },
    {
      id: 'earnings',
      number: t.business.blocks.earnings.number,
      theme: t.business.blocks.earnings.theme,
      text: t.business.blocks.earnings.text,
      videoTitle: t.business.blocks.earnings.videoTitle,
      cta: t.business.blocks.earnings.cta,
      nextAnchor: '#business-block-05',
      badge: 'Escala & Ganhos',
    },
    {
      id: 'start',
      number: t.business.blocks.start.number,
      theme: t.business.blocks.start.theme,
      text: t.business.blocks.start.text,
      videoTitle: t.business.blocks.start.videoTitle,
      cta: t.business.blocks.start.cta,
      link: '/formulario?tema=oportunidade-negocio&pais=mz',
      badge: 'Ação Imediata',
    },
  ];

  return (
    <section id="negocio" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/10 border border-emerald-600/30 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            {t.business.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {t.business.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
            {t.business.subtitle}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 shadow-sm font-medium">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{t.business.flowNotice}</span>
          </div>
        </div>

        {/* Interactive Goals Selector */}
        <div className="max-w-4xl mx-auto mb-14 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isPt ? 'Personalize o seu Percurso' : 'Customize Your Journey'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
              {isPt ? 'O que mais procura alcançar com a NeoLife?' : 'What do you most want to achieve with NeoLife?'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {isPt ? 'Selecione uma ou mais opções. Ficarão guardadas no seu pedido para personalizarmos a sua conversa.' : 'Select one or more goals to save them into your consultation request.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center">
            {availableGoals.map((goal) => {
              const label = isPt ? goal.labelPt : goal.labelEn;
              const isSelected = isBusinessGoalSelected(label);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleBusinessGoal(label)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500 scale-102'
                      : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-white text-emerald-800 font-black' : 'border border-gray-300 text-transparent'
                  }`}>
                    •
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sequential Script Blocks */}
        <div className="space-y-12 max-w-5xl mx-auto">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              id={`business-block-${block.number}`}
              className="relative bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Text Side (7 cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl sm:text-4xl font-black text-emerald-600/80 font-mono">
                        {block.number}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {block.badge}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                      {block.theme}
                    </h3>

                    <p className="text-gray-600 text-base leading-relaxed mb-6">
                      {block.text}
                    </p>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
                    {block.link ? (
                      <Link href={block.link}>
                        <Button size="md" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 shadow-sm">
                          {block.cta}
                        </Button>
                      </Link>
                    ) : (
                      <a href={block.nextAnchor}>
                        <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold">
                          {block.cta}
                        </Button>
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveModal({ title: block.videoTitle, videoUrl: getVideoUrl(index + 1) })}
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline py-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>{block.videoTitle}</span>
                    </button>
                  </div>
                </div>

                {/* Video Window (5 cols) */}
                <div className="lg:col-span-5">
                  <div
                    onClick={() => setActiveModal({ title: block.videoTitle, videoUrl: getVideoUrl(index + 1) })}
                    className="relative aspect-video rounded-2xl bg-gradient-to-tr from-gray-950 via-gray-900 to-emerald-950 border-2 border-gray-800 shadow-md overflow-hidden cursor-pointer group/video flex flex-col justify-between p-4"
                  >
                    {/* Top video pill */}
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-emerald-300 border border-emerald-500/30">
                        Vídeo Curto • Módulo {block.number}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        HD 1080p
                      </span>
                    </div>

                    {/* Center Play Button */}
                    <div className="self-center flex flex-col items-center gap-2 z-10 group-hover/video:scale-105 transition-transform duration-300">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg shadow-emerald-900/50 group-hover/video:bg-emerald-400">
                        <svg className="w-7 h-7 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-white text-xs font-semibold drop-shadow">
                        Clique para assistir
                      </span>
                    </div>

                    {/* Bottom info */}
                    <div className="z-10 bg-black/50 backdrop-blur-xs rounded-xl p-2 border border-white/5">
                      <p className="text-white text-xs font-medium truncate">
                        {block.videoTitle}
                      </p>
                    </div>

                    {/* Background subtle mesh glow */}
                    <div className="absolute inset-0 bg-radial from-emerald-600/10 to-transparent opacity-60 group-hover/video:opacity-100 transition-opacity" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Closing Mentorship Banner */}
        <div className="mt-16 max-w-4xl mx-auto bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-200 mb-1">
              Mentoria Garantida
            </p>
            <h4 className="text-2xl font-bold text-white mb-2">
              Dúvidas sobre o modelo de negócio?
            </h4>
            <p className="text-emerald-100 text-sm max-w-lg">
              Ofélia e José Machado respondem pessoalmente sem qualquer pressão ou compromisso.
            </p>
          </div>
          <Link href="/formulario?tema=oportunidade-negocio&pais=mz" className="shrink-0">
            <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-8 shadow-md">
              Marcar Conversa Gratuita
            </Button>
          </Link>
        </div>

      </div>

      <VideoModal
        isOpen={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        title={activeModal?.title || ''}
        videoUrl={activeModal?.videoUrl}
      />
    </section>
  );
};
