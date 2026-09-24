'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { getCountryById, getAllowedDialCodes, countries } from '@/data/countries';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Country } from '@/types';

function GateContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/saude';
  const pillar = searchParams.get('pillar') || 'saude';

  const { language } = useLanguage();
  const isPt = language === 'pt';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [selectedCountryId, setSelectedCountryId] = useState('mz-pt');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const country: Country = getCountryById(selectedCountryId) || getCountryById('mz-pt') || {
    id: 'mz-pt',
    name: 'Moçambique (Português)',
    code: 'MZ',
    flag: '🇲🇿',
    dialCode: '+258',
    available: true,
  };

  const pillarTitles = {
    saude: isPt ? 'Soluções de Saúde' : 'Health Solutions',
    business: isPt ? 'Oportunidade de Negócio' : 'Business Opportunity',
    experiencias: isPt ? 'Experiências & Viagens' : 'Experiences & Travel',
  };

  const pillarDescriptions = {
    saude: isPt
      ? 'Explore suplementos com base científica, produtos de higiene pessoal e soluções de limpeza ecológica.'
      : 'Discover science-backed supplements, personal care, and eco-friendly home cleaning solutions.',
    business: isPt
      ? 'Conheça o modelo passo a passo, veja os vídeos explicativos e selecione os seus objetivos de negócio.'
      : 'Understand the business model step by step, watch explanatory videos, and select your business goals.',
    experiencias: isPt
      ? 'Descubra viagens exclusivas, reconhecimento global e experiências de comunidade internacional.'
      : 'Discover exclusive travel, global recognition, and international community experiences.',
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const isPhoneFromAllowedCountry = (phone: string): boolean => {
    const allowedCodes = getAllowedDialCodes();
    const cleaned = phone.trim().replace(/\s+/g, '');
    return allowedCodes.some((code) => cleaned.startsWith(code));
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = isPt ? 'Nome é obrigatório' : 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = isPt ? 'Telefone é obrigatório' : 'Phone is required';
    } else if (!isPhoneFromAllowedCountry(formData.phone)) {
      newErrors.phone = isPt
        ? `O número deve começar com o indicativo do seu país (ex: ${country.dialCode}).`
        : `Phone number must start with country dial code (e.g. ${country.dialCode}).`;
    }

    if (!formData.email.trim()) {
      newErrors.email = isPt ? 'E-mail é obrigatório' : 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = isPt ? 'E-mail inválido' : 'Invalid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Save to leads API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: selectedCountryId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          theme: `gate-${pillar}`,
          source: 'website-gate',
          notes: `Usuário acessou o gate para o pilar: ${pillar}`,
        }),
      });

      if (response.ok) {
        // Save gate completion to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('neolife_gate_completed', 'true');
          localStorage.setItem('neolife_gate_timestamp', Date.now().toString());
          localStorage.setItem('neolife_gate_email', formData.email);
          localStorage.setItem('neolife_gate_name', formData.name);
          localStorage.setItem('neolife_gate_phone', formData.phone);
          localStorage.setItem('neolife_gate_country', selectedCountryId);
        }

        setSubmitSuccess(true);
        
        // Redirect to intro page after success
        setTimeout(() => {
          const introUrl = `/intro?pillar=${pillar}&redirect=${encodeURIComponent(redirectTo)}`;
          window.location.href = introUrl;
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao submeter formulário. Por favor, tente novamente.');
      }
    } catch (error: any) {
      console.error('Error submitting gate form:', error);
      setErrors({ submit: error.message || 'Erro ao enviar formulário. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isPt ? 'Acesso Liberado!' : 'Access Granted!'}
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            {isPt
              ? 'Redirecionando para o conteúdo...'
              : 'Redirecting to content...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-16 md:py-24">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {isPt ? 'Acesso Rápido' : 'Quick Access'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {isPt ? 'Antes de Continuar' : 'Before You Continue'}
          </h1>
          <p className="text-gray-600 text-sm max-w-xs mx-auto mb-6">
            {isPt
              ? 'Para proporcionar um atendimento personalizado, precisamos de alguns dados básicos.'
              : 'To provide personalized service, we need some basic information.'}
          </p>

          {/* Pillar Preview Card */}
          <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 00 11-18 0 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {isPt ? 'Você está acessando:' : 'You are accessing:'}
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {pillarTitles[pillar as keyof typeof pillarTitles]}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-3 text-left">
              {pillarDescriptions[pillar as keyof typeof pillarDescriptions]}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Country Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {isPt ? 'País de Residência' : 'Country of Residence'}
              </label>
              <select
                value={selectedCountryId}
                onChange={(e) => {
                  setSelectedCountryId(e.target.value);
                  const newC = getCountryById(e.target.value);
                  if (newC && newC.dialCode && !formData.phone.startsWith(newC.dialCode)) {
                    setFormData((prev) => ({ ...prev, phone: `${newC.dialCode} ` }));
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {countries.filter((c) => c.available).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name} ({c.dialCode})
                  </option>
                ))}
              </select>
            </div>

            <Input
              label={isPt ? 'Nome Completo' : 'Full Name'}
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={isPt ? 'Digite o seu nome completo' : 'Enter your full name'}
              error={errors.name}
              required
            />

            <div>
              <Input
                label={`${isPt ? 'Telefone / WhatsApp' : 'Phone / WhatsApp'} (${country.dialCode})`}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={`${country.dialCode} 84 000 0000`}
                error={errors.phone}
                required
              />
              {!errors.phone && (
                <p className="mt-1 text-xs text-gray-500">
                  {isPt ? 'Indicativo oficial:' : 'Dial code:'} <span className="font-mono font-bold text-emerald-800">{country.dialCode}</span>
                </p>
              )}
            </div>

            <Input
              label="E-mail"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={isPt ? 'exemplo@email.com' : 'example@email.com'}
              error={errors.email}
              required
            />

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errors.submit}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl shadow-md text-sm"
            >
              {isSubmitting
                ? (isPt ? 'A Processar...' : 'Processing...')
                : (isPt ? 'Continuar para o Conteúdo ➔' : 'Continue to Content ➔')}
            </Button>

            <p className="text-center pt-2 text-xs text-gray-500">
              {isPt ? 'Seus dados estão seguros e não serão compartilhados.' : 'Your data is safe and will not be shared.'}
            </p>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-xs font-semibold text-gray-600 hover:text-emerald-700 underline"
          >
            {isPt ? '← Voltar para a página inicial' : '← Back to home page'}
          </a>
        </div>

      </div>
    </div>
  );
}

export default function GatePage() {
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
      <GateContent />
    </Suspense>
  );
}