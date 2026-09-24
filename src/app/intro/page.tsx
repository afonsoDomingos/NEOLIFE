'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/i18n/LanguageContext';

function IntroContent() {
  const searchParams = useSearchParams();
  const pillar = searchParams.get('pillar') || 'saude';
  const redirectTo = searchParams.get('redirect') || '/saude';

  const { language } = useLanguage();
  const isPt = language === 'pt';

  const [videoWatched, setVideoWatched] = useState(false);

  // Video URLs by pillar and language
  const videoUrls = {
    saude: {
      en: 'https://s3.us-east-1.amazonaws.com/static.gnld.com/za/resourceslibrary/videos/NeoLife%20Farm%20To%20Table-WA.mp4',
      pt: 'https://s3.us-east-1.amazonaws.com/static.gnld.com/za/resourceslibrary/videos/Farm%20To%20Table%20Portuguese-WA.mp4',
    },
    business: {
      en: 'https://s3.us-east-1.amazonaws.com/static.gnld.com/za/resourceslibrary/videos/Distributor%20Journey.mp4',
      pt: 'https://s3.us-east-1.amazonaws.com/static.gnld.com/za/resourceslibrary/videos/Distributor%20Journey%20Portuguese-WA.mp4',
    },
    experiencias: {
      en: 'https://www.youtube.com/watch?v=7cpeXtIQUgo',
      pt: 'https://www.youtube.com/watch?v=7cpeXtIQUgo',
    },
  };

  const pillarInfo = {
    saude: {
      title: isPt ? 'NeoLife: Do Campo à Mesa' : 'NeoLife: Farm To Table',
      description: isPt
        ? 'Descubra a ciência por trás dos nossos produtos e o compromisso com qualidade desde a origem até você.'
        : 'Discover the science behind our products and our commitment to quality from source to you.',
      color: 'emerald',
      btnClass: 'bg-emerald-700 hover:bg-emerald-800',
    },
    business: {
      title: isPt ? 'Jornada do Distribuidor NeoLife' : 'NeoLife Distributor Journey',
      description: isPt
        ? 'Veja como milhares de pessoas estão transformando suas vidas através do modelo de negócio NeoLife.'
        : 'See how thousands of people are transforming their lives through the NeoLife business model.',
      color: 'emerald',
      btnClass: 'bg-emerald-700 hover:bg-emerald-800',
    },
    experiencias: {
      title: isPt ? 'Experiências NeoLife' : 'NeoLife Experiences',
      description: isPt
        ? 'Conheça as viagens, o reconhecimento e a comunidade global que esperam por você na NeoLife.'
        : 'Discover the travel, recognition, and global community waiting for you at NeoLife.',
      color: 'teal',
      btnClass: 'bg-teal-700 hover:bg-teal-800',
    },
  };

  const currentVideoUrl = videoUrls[pillar as keyof typeof videoUrls]?.[isPt ? 'pt' : 'en'] || videoUrls.saude.en;
  const currentPillarInfo = pillarInfo[pillar as keyof typeof pillarInfo] || pillarInfo.saude;
  const isYouTube = currentVideoUrl.includes('youtube.com') || currentVideoUrl.includes('youtu.be');

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const handleContinue = () => {
    window.location.href = redirectTo;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {isPt ? 'Introdução' : 'Introduction'}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {currentPillarInfo.title}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            {currentPillarInfo.description}
          </p>
        </div>

        {/* Video Container */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 mb-8">
          <div className="aspect-video w-full bg-black">
            {isYouTube ? (
              <iframe
                src={getYouTubeEmbedUrl(currentVideoUrl)}
                title={currentPillarInfo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onEnded={() => setVideoWatched(true)}
              />
            ) : (
              <video
                src={currentVideoUrl}
                controls
                className="w-full h-full"
                onEnded={() => setVideoWatched(true)}
                autoPlay
              >
                <track kind="captions" />
              </video>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={handleContinue}
            size="lg"
            className={`${currentPillarInfo.btnClass} text-white font-extrabold px-8 py-4 rounded-xl shadow-lg text-sm sm:text-base`}
          >
            {isPt ? 'Continuar para o Conteúdo →' : 'Continue to Content →'}
          </Button>
          
          <p className="mt-4 text-xs text-gray-500">
            {isPt ? 'Assista ao vídeo para obter o melhor contexto' : 'Watch the video for the best context'}
          </p>
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={handleContinue}
            className="text-xs text-gray-400 hover:text-gray-600 underline"
          >
            {isPt ? 'Pular vídeo e continuar →' : 'Skip video and continue →'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function IntroPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">A carregar...</p>
          </div>
        </div>
      }
    >
      <IntroContent />
    </Suspense>
  );
}