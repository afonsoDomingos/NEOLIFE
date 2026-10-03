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
              <h5 className="text-white font-bold text-lg mb-2">VÃ­deo em FinalizaÃ§Ã£o de GravaÃ§Ã£o</h5>
              <p className="text-gray-400 text-sm mb-6">
                Este vÃ­deo curto gravado pelo JosÃ© Sarmento Machado estÃ¡ em fase de upload. Entretanto, pode esclarecer todas as dÃºvidas diretamente connosco no WhatsApp!
              </p>
              <a
                href="https://wa.me/258823056900?text=OlÃ¡ JosÃ© e OfÃ©lia, gostaria de saber mais sobre este tÃ³pico de negÃ³cio da NeoLife"
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
  const { toggleBusinessGoal, isBusinessGoalSelected } = useSelection();
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [activeModal, setActiveModal] = useState<{ title: string; videoUrl?: string } | null>(null);
  const [businessVideos, setBusinessVideos] = useState<BusinessVideo[]>([]);

  const availableGoals = [
    { id: 'extra-income', labelPt: 'Rendimento Extra SustentÃ¡vel', labelEn: 'Extra Sustainable Income' },
    { id: 'full-time', labelPt: 'NegÃ³cio PrÃ³prio / Carreira Independente', labelEn: 'Full-Time Independent Business' },
    { id: 'mentorship', labelPt: 'Mentoria Direta com JosÃ© e OfÃ©lia', labelEn: 'Direct Mentorship with JosÃ© & OfÃ©lia' },
    { id: 'time-freedom', labelPt: 'Liberdade de Tempo & HorÃ¡rios FlexÃ­veis', labelEn: 'Time Freedom & Flexible Hours' },
    { id: 'global-scale', labelPt: 'ExpansÃ£o Internacional (50+ PaÃ­ses)', labelEn: 'Global Business (50+ Countries)' },
  ];

  useEffect(() => {
    fetch('/api/videos?category=Business')
      .then((r) => r.json())
      .then((data: BusinessVideo[]) => {
        if (Array.isArray(data)) setBusinessVideos(data);
      })
      .catch(() => {/* silent */});
  }, []);

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
      badge: 'AÃ§Ã£o Imediata',
    },
  ];

  return (
    <section id="negocio" className="py-10 md:py-14 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/10 border border-emerald-600/30 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            {t.business.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {t.business.title}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t.business.subtitle}
          </p>
        </div>


        {/* Social Share Bar */}
        <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-gray-400 font-medium mr-1">
            {isPt ? 'Partilhar:' : 'Share:'}
          </span>
          <a
            href={`https://wa.me/?text=${encodeURIComponent('Descobre a oportunidade de negócio NeoLife 👉 https://neolifemz.vercel.app/business')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.057 23.929l6.241-1.635A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.374l-.36-.213-3.707.972.988-3.614-.234-.372A9.818 9.818 0 1112 21.818z"/></svg>
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://neolifemz.vercel.app/business')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#0d6edf] text-white text-xs font-semibold transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </a>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText('https://neolifemz.vercel.app/business');
              alert(isPt ? '✅ Link copiado! Cola no Instagram.' : '✅ Link copied! Paste on Instagram.');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] hover:opacity-90 text-white text-xs font-semibold transition-all shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Instagram
          </button>
        </div>
        {/* Goals Selector */}
        <div className="mb-6 bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 mb-3 text-center">
            {isPt ? 'O que mais procura alcanÃ§ar com a NeoLife?' : 'What do you most want to achieve with NeoLife?'}
          </p>
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
                </button>
              );
            })}
          </div>
        </div>

        {/* Accordion */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {blocks.map((block, index) => {
            const isOpen = activeIndex === index;
            const videoUrl = getVideoUrl(index + 1);

            return (
              <div key={block.id}>
                {/* Tab Header (always visible) */}
                <button
                  type="button"
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                    isOpen
                      ? 'bg-emerald-50 border-l-4 border-emerald-600'
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  {/* Number */}
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 text-xs font-black font-mono transition-colors ${
                    isOpen ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {block.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isOpen ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {block.badge}
                      </span>
                    </div>
                    <p className={`text-sm font-bold mt-0.5 transition-colors ${
                      isOpen ? 'text-emerald-800' : 'text-gray-800'
                    }`}>
                      {block.theme}
                    </p>
                  </div>

                  {/* Chevron */}
                  <svg
                    className={`w-4 h-4 shrink-0 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expandable Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-4 pt-2 bg-emerald-50/50">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {block.text}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      {block.link ? (
                        <Link href={block.link}>
                          <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 shadow-sm">
                            {block.cta}
                          </Button>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveIndex(index + 1 < blocks.length ? index + 1 : null);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors"
                        >
                          {block.cta}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}

                      {videoUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveModal({ title: block.videoTitle, videoUrl })}
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
            );
          })}
        </div>

        {/* Closing Mentorship Banner */}
        <div className="relative mt-6 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/30">
          {/* Background Image with Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/sections/fundo-business-mentoria.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/92 via-emerald-900/85 to-emerald-950/90" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <p className="text-xs uppercase font-extrabold tracking-widest text-emerald-300 mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Mentoria Garantida
              </p>
              <h4 className="text-lg font-bold text-white mb-1 drop-shadow-md">
                Dúvidas sobre o modelo de negócio?
              </h4>
              <p className="text-emerald-100/90 text-sm drop-shadow">
                Ofélia e José Machado respondem pessoalmente sem qualquer pressão.
              </p>
            </div>
            <Link href="/formulario?tema=oportunidade-negocio&pais=mz-pt" className="shrink-0">
              <Button size="sm" className="bg-white !text-emerald-900 hover:bg-emerald-50 font-bold px-6 shadow-lg whitespace-nowrap">
                Marcar Conversa Gratuita
              </Button>
            </Link>
          </div>
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

