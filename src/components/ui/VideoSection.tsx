'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './Card';
import { SlideUpText, TypewriterText } from './AnimatedText';
import { getEmbedUrl } from '@/lib/utils/video';

interface VideoData {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export const VideoSection: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeModalVideo, setActiveModalVideo] = useState<VideoData | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      if (res.ok) {
        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error loading public videos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && videos.length === 0) {
    return null; // Hide section if no videos exist
  }

  const categories = ['Todos', ...Array.from(new Set(videos.map(v => v.category).filter(Boolean)))];

  const filteredVideos = selectedCategory === 'Todos'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const featuredVideo = videos.find(v => v.featured) || videos[0];

  return (
    <section id="videos" className="py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-3">
            <span>🎥</span> Multimédia & Conteúdos Oficiais
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            <TypewriterText 
              text="Vídeos & Apresentações"
              speed={120}
            />
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            <SlideUpText 
              text="Explore a oportunidade NeoLife, conheça a nossa ciência nutricional e inspire-se com histórias reais de transformação."
              delay={300}
            />
          </p>
        </div>

        {/* Featured Video Spotlight */}
        {featuredVideo && selectedCategory === 'Todos' && (
          <div className="mb-14">
            <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 relative aspect-video bg-black group cursor-pointer" onClick={() => setActiveModalVideo(featuredVideo)}>
                {featuredVideo.thumbnailUrl ? (
                  <img
                    src={featuredVideo.thumbnailUrl}
                    alt={featuredVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-400">
                    NeoLife Vídeo
                  </div>
                )}
                {/* Play Button */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform pl-1">
                    <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-500 text-white shadow-md flex items-center gap-1">
                    ⭐ Vídeo em Destaque
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between text-white">
                <div>
                  <span className="inline-block px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    {featuredVideo.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-4 leading-relaxed mb-6">
                    {featuredVideo.description || 'Assista a este vídeo para saber mais sobre como a NeoLife está a criar impacto positivo em todo o mundo.'}
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => setActiveModalVideo(featuredVideo)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
                  >
                    <span>▶ Assistir Agora</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((v) => {
            const vidId = v._id || v.id || v.videoUrl;
            return (
              <Card
                key={vidId}
                className="group overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between border border-gray-100 bg-white"
                onClick={() => setActiveModalVideo(v)}
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    {v.thumbnailUrl ? (
                      <img
                        src={v.thumbnailUrl}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400 text-xs">
                        NeoLife Vídeo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-emerald-600/90 group-hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform pl-0.5">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-black/70 text-white backdrop-blur-sm">
                        {v.category}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2 mb-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {v.description || 'Clique para assistir a este vídeo da NeoLife.'}
                    </p>
                  </CardContent>
                </div>

                <div className="px-5 pb-5 pt-0 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Assistir vídeo →
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {activeModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveModalVideo(null)}
        >
          <div
            className="bg-black rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl relative border border-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 bg-gray-950 border-b border-gray-800 text-white">
              <div className="truncate pr-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 mr-2">
                  {activeModalVideo.category}
                </span>
                <span className="text-sm font-bold">{activeModalVideo.title}</span>
              </div>
              <button
                onClick={() => setActiveModalVideo(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/30 text-white flex items-center justify-center text-base transition-colors"
                aria-label="Fechar"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`${getEmbedUrl(activeModalVideo.videoUrl)}?autoplay=1&rel=0`}
                title={activeModalVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer with CTA */}
            {activeModalVideo.description && (
              <div className="p-4 bg-gray-950 text-gray-300 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="line-clamp-2 max-w-xl">{activeModalVideo.description}</p>
                <a
                  href="#temas"
                  onClick={() => setActiveModalVideo(null)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs whitespace-nowrap text-center transition-colors"
                >
                  Quero Saber Mais
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
