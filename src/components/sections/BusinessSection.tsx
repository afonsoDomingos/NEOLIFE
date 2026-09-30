'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useSelection } from '@/lib/context/SelectionContext';
import { Button } from '@/components/ui/Button';
import { getEmbedUrl } from '@/lib/utils/video';

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

  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : '';

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
          {embedUrl ? (
            <iframe
              src={`${embedUrl}?autoplay=1&rel=0`}
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
      link: '/formulario?tema=oportunidade-negocio&pais=mz-pt',
      badge: 'Ação Imediata',
    },
  ];

  return (
    <section id="negocio" className="py-10 md:py-14 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/10 border border-emerald-600/30 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {t.business.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {t.business.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            {t.business.subtitle}
          </p>
        </div>

        {/* Interactive Goals Selector */}
        <div className="max-w-3xl mx-auto mb-8 bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {isPt ? 'Personalize o seu Percurso' : 'Customize Your Journey'}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2">
              {isPt ? 'O que mais procura alcançar com a NeoLife?' : 'What do you most want to achieve with NeoLife?'}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {availableGoals.map((goal) => {
              const label = isPt ? goal.labelPt : goal.labelEn;
              const isSelected = isBusinessGoalSelected(label);
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => toggleBusinessGoal(label)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-500'
                      : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200'
                  }`}
                >
                  <span>{label}</span>
                  <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
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
        <div className="space-y-3 max-w-3xl mx-auto">
          {blocks.map((block, index) => (
            <div
              key={block.id}
              id={`business-block-${block.number}`}
              className="relative bg-white rounded-2xl px-5 py-4 border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-start gap-4">
                {/* Number */}
                <span className="text-2xl font-black text-emerald-600/70 font-mono leading-none pt-0.5 shrink-0">
                  {block.number}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {block.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-700 transition-colors">
                    {block.theme}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {block.text}
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center gap-3">
                    {block.link ? (
                      <Link href={block.link}>
                        <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 shadow-sm">
                          {block.cta}
                        </Button>
                      </Link>
                    ) : (
                      <a href={block.nextAnchor}>
                        <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs">
                          {block.cta}
                        </Button>
                      </a>
                    )}

                    {getVideoUrl(index + 1) && (
                      <button
                        type="button"
                        onClick={() => setActiveModal({ title: block.videoTitle, videoUrl: getVideoUrl(index + 1) })}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>{block.videoTitle}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing Mentorship Banner */}
        <div className="mt-8 max-w-3xl mx-auto bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white rounded-2xl p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-200 mb-1">
              Mentoria Garantida
            </p>
            <h4 className="text-lg font-bold text-white mb-1">
              Dúvidas sobre o modelo de negócio?
            </h4>
            <p className="text-emerald-100 text-sm">
              Ofélia e José Machado respondem pessoalmente sem qualquer pressão.
            </p>
          </div>
          <Link href="/formulario?tema=oportunidade-negocio&pais=mz-pt" className="shrink-0">
            <Button size="sm" className="bg-white text-emerald-900 hover:bg-emerald-50 font-bold px-6 shadow-md">
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
