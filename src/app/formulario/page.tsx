'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Select, Textarea } from '@/components/ui/Input';
import { getCountryById, getAllowedDialCodes, countries } from '@/data/countries';
import { getThemeBySlug } from '@/data/themes';
import { useSelection } from '@/lib/context/SelectionContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { Country } from '@/types';

/* ─── Step indicator ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <React.Fragment key={step}>
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                active
                  ? 'bg-emerald-700 text-white shadow-lg scale-110'
                  : done
                  ? 'bg-emerald-200 text-emerald-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {done ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : step}
            </div>
            {step < total && (
              <div className={`flex-1 h-0.5 max-w-[40px] transition-all duration-500 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── Fancy field with icon ─── */
function IconField({
  icon, label, children, error,
}: { icon: React.ReactNode; label: string; children: React.ReactNode; error?: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
          {icon}
        </div>
        <label className="text-sm font-bold text-gray-800">{label}</label>
      </div>
      {children}
      {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}

/* ─── Main form content ─── */
function FormularioContent() {
  const searchParams = useSearchParams();
  const themeSlug = searchParams.get('tema');
  const countryId = searchParams.get('pais') || 'mz-pt';
  const campaign = searchParams.get('campanha');
  const initialNotes = searchParams.get('notas') || searchParams.get('notes') || '';

  const { language } = useLanguage();
  const isPt = language === 'pt';

  const {
    selectedHealthPacks, removeHealthPack, customHealthNeed, setCustomHealthNeed,
    businessGoals, toggleBusinessGoal, experienceInterests, toggleExperienceInterest,
    clearAllSelections, totalItemsCount,
  } = useSelection();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', source: '', notes: initialNotes,
  });
  const [selectedCountryId, setSelectedCountryId] = useState(countryId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const country: Country = getCountryById(selectedCountryId) || getCountryById('mz-pt') || {
    id: 'mz-pt', name: 'Moçambique (Português)', code: 'MZ', flag: '🇲🇿', dialCode: '+258', available: true,
  };

  const [theme, setTheme] = useState<any>(() =>
    themeSlug ? getThemeBySlug(themeSlug) || null : {
      title: isPt ? 'Aconselhamento Personalizado Neolife' : 'Personalized Neolife Consultation',
      description: isPt ? 'Revisão dos seus objetivos com os nossos mentores.' : 'Review your goals with our mentors.',
      slug: 'consulta-geral',
    }
  );

  useEffect(() => {
    if (themeSlug) {
      fetch(`/api/themes?slug=${encodeURIComponent(themeSlug)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d?.slug) setTheme(d); })
        .catch(() => {});
    }
  }, [themeSlug]);

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isPhoneValid = (p: string) => {
    const codes = getAllowedDialCodes();
    const clean = p.trim().replace(/\s+/g, '');
    return codes.some((c) => clean.startsWith(c));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!formData.name.trim()) e.name = isPt ? 'Nome é obrigatório' : 'Name is required';
      if (!formData.phone.trim()) e.phone = isPt ? 'WhatsApp é obrigatório' : 'WhatsApp is required';
      else if (!isPhoneValid(formData.phone)) e.phone = isPt ? `Inclua o indicativo (ex: ${country.dialCode})` : `Include dial code (e.g. ${country.dialCode})`;
      if (!formData.email.trim()) e.email = isPt ? 'E-mail é obrigatório' : 'Email is required';
      else if (!isValidEmail(formData.email)) e.email = isPt ? 'E-mail inválido' : 'Invalid email';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildNotes = (): string => {
    const lines: string[] = [];
    if (selectedHealthPacks.length) { lines.push('PACOTES DE SAÚDE:'); selectedHealthPacks.forEach((p, i) => lines.push(`  ${i+1}. ${p.title}`)); }
    if (customHealthNeed.trim()) { lines.push('\nOUTRAS NECESSIDADES:'); lines.push(`  "${customHealthNeed}"`); }
    if (businessGoals.length) { lines.push('\nMETAS DE NEGÓCIO:'); businessGoals.forEach((g) => lines.push(`  • ${g}`)); }
    if (experienceInterests.length) { lines.push('\nEXPERIÊNCIAS:'); experienceInterests.forEach((e) => lines.push(`  • ${e}`)); }
    if (formData.notes.trim()) { lines.push('\nOBSERVAÇÕES:'); lines.push(`  ${formData.notes}`); }
    return lines.join('\n');
  };

  const getWhatsAppUrl = () => {
    const notes = buildNotes();
    const text = `Olá José e Ofélia! Submeti o meu interesse na Neolife:\n\nNome: ${formData.name || '(Novo Contacto)'}\nTelefone: ${formData.phone}\n\n${notes}`;
    return `https://wa.me/258823056900?text=${encodeURIComponent(text)}`;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountryId,
          name: formData.name, phone: formData.phone, email: formData.email,
          whatsapp: formData.phone || undefined,
          theme: theme?.slug || 'consulta-personalizada',
          source: formData.source || 'website-formulario',
          campaign: campaign || undefined,
          notes: buildNotes() || undefined,
        }),
      });
      if (res.ok) {
        clearAllSelections();
        setSubmitSuccess(true);
        setTimeout(() => { window.location.href = '/confirmacao'; }, 1200);
      } else {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || 'Erro ao submeter');
      }
    } catch (err: any) {
      setErrors({ submit: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* Success state */
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{isPt ? 'Pedido Enviado!' : 'Request Sent!'}</h2>
          <p className="text-gray-600 mb-6 text-sm">{isPt ? 'Entraremos em contacto brevemente.' : 'We will be in touch shortly.'}</p>
          <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
            className="inline-block py-3 px-8 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm shadow-lg">
            {isPt ? 'Falar no WhatsApp ➔' : 'Chat on WhatsApp ➔'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/60 via-white to-gray-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-5xl">
        {/* ── SPLIT CARD ── */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] border border-emerald-100">

          {/* LEFT — Image panel */}
          <div className="relative lg:w-2/5 min-h-[260px] lg:min-h-0 overflow-hidden">
            <img
              src="/images/sections/formulario-pessoa.jpg"
              alt="Bem-vindo à NeoLife"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-900/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-white/20" />

            {/* Bottom text on image */}
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/90 text-emerald-950 text-xs font-extrabold uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse" />
                NeoLife
              </div>
              <h2 className="text-white text-xl lg:text-2xl font-extrabold leading-tight drop-shadow-md">
                {isPt ? 'O seu caminho para\numa vida melhor começa aqui.' : 'Your path to a\nbetter life starts here.'}
              </h2>
              <p className="text-emerald-100/90 text-xs mt-2 drop-shadow">
                {isPt ? 'Saúde · Business · Experiências' : 'Health · Business · Experiences'}
              </p>
            </div>
          </div>

          {/* RIGHT — Form panel */}
          <div className="flex-1 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
                {isPt ? 'Antes de Continuar' : 'Before We Continue'}
              </h1>
              <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                {isPt
                  ? 'Para proporcionar um atendimento personalizado, precisamos de alguns dados básicos.'
                  : 'To provide personalized guidance, we need a few basic details.'}
              </p>
            </div>

            {/* Step indicator */}
            <StepIndicator current={step} total={3} />
            <p className="text-xs font-bold text-center text-gray-500 mb-6 -mt-3">
              {isPt ? `Passo ${step} de 3` : `Step ${step} of 3`}
            </p>

            {/* ── STEP 1: Dados Pessoais ── */}
            {step === 1 && (
              <div className="space-y-4">
                {/* Nome */}
                <IconField
                  label={isPt ? 'Nome Completo' : 'Full Name'}
                  error={errors.name}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  }
                >
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => { setFormData((p) => ({ ...p, name: e.target.value })); setErrors((p) => ({ ...p, name: '' })); }}
                    placeholder={isPt ? 'Digite o seu nome completo' : 'Enter your full name'}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${errors.name ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                  />
                </IconField>

                {/* WhatsApp */}
                <IconField
                  label={`${isPt ? 'Número de WhatsApp' : 'WhatsApp Number'}`}
                  error={errors.phone}
                  icon={
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  }
                >
                  <div className="flex gap-2">
                    <select
                      value={selectedCountryId}
                      onChange={(e) => {
                        setSelectedCountryId(e.target.value);
                        const c = getCountryById(e.target.value);
                        if (c?.dialCode) setFormData((p) => ({ ...p, phone: `${c.dialCode} ` }));
                      }}
                      className="px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                    >
                      {countries.filter((c) => c.available).map((c) => (
                        <option key={c.id} value={c.id}>{c.flag} {c.dialCode}</option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => { setFormData((p) => ({ ...p, phone: e.target.value })); setErrors((p) => ({ ...p, phone: '' })); }}
                      placeholder={`${country.dialCode} 84 000 0000`}
                      className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${errors.phone ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                    />
                  </div>
                </IconField>

                {/* Email */}
                <IconField
                  label={isPt ? 'Endereço de Email' : 'Email Address'}
                  error={errors.email}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                >
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setErrors((p) => ({ ...p, email: '' })); }}
                    placeholder={isPt ? 'Digite o seu endereço de email' : 'Enter your email address'}
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${errors.email ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                  />
                </IconField>

                <button
                  onClick={handleNext}
                  className="w-full mt-2 py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  {isPt ? 'Próximo' : 'Next'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            )}

            {/* ── STEP 2: Seleções / Resumo ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">{isPt ? 'Resumo da Seleção' : 'Selection Summary'}</h3>
                    {totalItemsCount > 0 && (
                      <button onClick={clearAllSelections} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                        {isPt ? 'Limpar' : 'Clear'}
                      </button>
                    )}
                  </div>
                  {totalItemsCount === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500 mb-3">{isPt ? 'Nenhum item selecionado ainda.' : 'No items selected yet.'}</p>
                      <div className="flex gap-2 justify-center">
                        <Link href="/saude"><span className="text-xs px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-semibold hover:bg-emerald-50 cursor-pointer">Ver Saúde ➔</span></Link>
                        <Link href="/business"><span className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer">Ver Business ➔</span></Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {selectedHealthPacks.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-emerald-200">
                          <span className="font-semibold text-gray-800">{p.title}</span>
                          <button onClick={() => removeHealthPack(p.id)} className="text-red-400 hover:text-red-600 font-bold px-1">×</button>
                        </div>
                      ))}
                      {businessGoals.map((g, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200">
                          <span className="text-gray-700">{g}</span>
                          <button onClick={() => toggleBusinessGoal(g)} className="text-red-400 hover:text-red-600 font-bold px-1">×</button>
                        </div>
                      ))}
                      {experienceInterests.map((e, i) => (
                        <div key={i} className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-teal-200">
                          <span className="text-gray-700">{e}</span>
                          <button onClick={() => toggleExperienceInterest(e)} className="text-red-400 hover:text-red-600 font-bold px-1">×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Como conheceu */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{isPt ? 'Como conheceu a NeoLife? (Opcional)' : 'How did you hear about us? (Optional)'}</label>
                  <select value={formData.source} onChange={(e) => setFormData((p) => ({ ...p, source: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none">
                    <option value="">{isPt ? 'Selecione uma opção' : 'Select an option'}</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="amigo">{isPt ? 'Amigo / Indicação' : 'Friend / Referral'}</option>
                    <option value="google">Google</option>
                    <option value="outro">{isPt ? 'Outro' : 'Other'}</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                    ←
                  </button>
                  <button onClick={handleNext} className="flex-1 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2">
                    {isPt ? 'Próximo' : 'Next'} →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Mensagem + Confirmar ── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{isPt ? 'Mensagem / Notas (Opcional)' : 'Message / Notes (Optional)'}</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder={isPt ? 'Tem alguma dúvida ou preferência de contacto?' : 'Any questions or contact preferences?'}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
                  />
                </div>

                {/* Summary card */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs space-y-1.5">
                  <p className="font-bold text-gray-700 mb-2">{isPt ? 'Confirmar Dados:' : 'Confirm Details:'}</p>
                  <p><span className="text-gray-400">{isPt ? 'Nome:' : 'Name:'}</span> <span className="font-semibold text-gray-800">{formData.name}</span></p>
                  <p><span className="text-gray-400">WhatsApp:</span> <span className="font-semibold text-gray-800">{formData.phone}</span></p>
                  <p><span className="text-gray-400">Email:</span> <span className="font-semibold text-gray-800">{formData.email}</span></p>
                </div>

                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">{errors.submit}</div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-5 py-3.5 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors">
                    ←
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> {isPt ? 'A Enviar...' : 'Sending...'}</>
                    ) : (
                      <>{isPt ? 'Submeter Pedido' : 'Submit Request'} ✓</>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <a href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1.5">
                    {isPt ? 'Prefere enviar diretamente pelo WhatsApp?' : 'Prefer to send via WhatsApp?'}
                  </a>
                </div>
              </div>
            )}

            {/* Privacy note */}
            <p className="text-center text-[11px] text-gray-400 mt-6 flex items-center justify-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              {isPt ? 'Os seus dados estão seguros e não serão partilhados.' : 'Your data is safe and will never be shared.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FormularioPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">A carregar formulário...</p>
        </div>
      </div>
    }>
      <FormularioContent />
    </Suspense>
  );
}