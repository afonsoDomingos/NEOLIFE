'use client';

import React, { useEffect, useState, useRef } from 'react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface PillarCard {
  pillarId: 'saude' | 'business' | 'experiencias';
  image: string;
  altText?: string;
}

const PILLAR_META = {
  saude: {
    label: 'Saúde',
    subtitle: 'Pilar 01 — Nutrição & Vitalidade',
    color: 'emerald',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  business: {
    label: 'Business',
    subtitle: 'Pilar 02 — Empreendedorismo',
    color: 'emerald',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  experiencias: {
    label: 'Experiências',
    subtitle: 'Pilar 03 — Viagens & Lifestyle',
    color: 'teal',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
      </svg>
    ),
  },
} as const;

export default function AdminPillarCardsPage() {
  const [cards, setCards] = useState<PillarCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editImages, setEditImages] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const res = await fetch('/api/pillar-cards');
      if (res.ok) {
        const data: PillarCard[] = await res.json();
        setCards(data);
        const map: Record<string, string> = {};
        data.forEach((c) => { map[c.pillarId] = c.image; });
        setEditImages(map);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (pillarId: string) => {
    setSaving(pillarId);
    try {
      const res = await fetch(`/api/admin/pillar-cards/${pillarId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: editImages[pillarId] }),
      });
      if (res.ok) {
        setSuccess(pillarId);
        setTimeout(() => setSuccess(null), 3000);
        loadCards();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader
        title="Imagens dos Cards dos Pilares"
        showRefresh={true}
        onRefresh={loadCards}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info banner */}
        <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-900">Imagens da Página Principal</p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Estas imagens aparecem nos três cards de pilares da homepage. Faça upload de uma nova imagem para substituir a atual. Recomendado: formato vertical (3:4), mínimo 600×800px.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/2 mb-4" />
                <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['saude', 'business', 'experiencias'] as const).map((id) => {
              const meta = PILLAR_META[id];
              const currentImage = editImages[id] || '';
              const isSaving = saving === id;
              const isSuccess = success === id;

              return (
                <Card key={id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                        {meta.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{meta.label}</h3>
                        <p className="text-xs text-gray-500">{meta.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Current image preview */}
                    {currentImage && (
                      <div className="relative rounded-xl overflow-hidden border border-gray-100">
                        <img
                          src={currentImage}
                          alt={`Card ${meta.label}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute bottom-2 left-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                            Atual
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-2">
                        Nova Imagem
                      </label>
                      <ImageUpload
                        onUpload={(url) => setEditImages((prev) => ({ ...prev, [id]: url }))}
                        currentImage={currentImage}
                        folder={`neolife/pillar-cards`}
                      />
                    </div>

                    {/* Save button */}
                    <Button
                      className={`w-full font-bold transition-all ${
                        isSuccess
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                      onClick={() => handleSave(id)}
                      disabled={isSaving || !editImages[id]}
                    >
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          A guardar...
                        </span>
                      ) : isSuccess ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                          Guardado!
                        </span>
                      ) : (
                        'Guardar Imagem'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Live preview */}
        <div className="mt-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Pré-visualização dos Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['saude', 'business', 'experiencias'] as const).map((id) => {
              const meta = PILLAR_META[id];
              const img = editImages[id];
              const isDark = id === 'business';
              return (
                <div key={id} className={`rounded-2xl overflow-hidden border-2 shadow-md ${isDark ? 'border-emerald-500/50 bg-emerald-950' : 'border-gray-100 bg-white'}`}>
                  <div className="relative h-36 overflow-hidden">
                    {img ? (
                      <img src={img} alt={meta.label} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: isDark ? 0.7 : 1 }} />
                    ) : (
                      <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-400">Sem imagem</span>
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-b ${isDark ? 'from-emerald-950/20 via-emerald-950/40 to-emerald-950' : 'from-white/5 via-white/20 to-white'}`} />
                  </div>
                  <div className={`px-4 py-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>{meta.subtitle.split('—')[0].trim()}</p>
                    <p className="text-sm font-bold">{meta.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            A pré-visualização atualiza conforme seleciona novas imagens.
          </p>
        </div>
      </div>
    </div>
  );
}
