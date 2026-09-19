'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { getCountryById, getAllowedDialCodes, countries } from '@/data/countries';
import { getThemeBySlug } from '@/data/themes';
import { useSelection } from '@/lib/context/SelectionContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Link from 'next/link';
import { Country } from '@/types';

function FormularioContent() {
  const searchParams = useSearchParams();
  const themeSlug = searchParams.get('tema');
  const countryId = searchParams.get('pais') || 'mz';
  const campaign = searchParams.get('campanha');
  const initialNotes = searchParams.get('notas') || searchParams.get('notes') || '';

  const { language } = useLanguage();
  const isPt = language === 'pt';

  const {
    selectedHealthPacks,
    removeHealthPack,
    customHealthNeed,
    setCustomHealthNeed,
    businessGoals,
    toggleBusinessGoal,
    experienceInterests,
    toggleExperienceInterest,
    clearAllSelections,
    totalItemsCount,
  } = useSelection();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
    source: '',
    notes: initialNotes,
  });
  const [selectedCountryId, setSelectedCountryId] = useState(countryId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Fallback country and theme so the form NEVER kicks the user out
  const country: Country = getCountryById(selectedCountryId) || getCountryById('mz') || {
    id: 'mz',
    name: 'Moçambique',
    code: 'MZ',
    flag: '🇲🇿',
    dialCode: '+258',
    available: true,
  };

  const [theme, setTheme] = useState<any>(() =>
    themeSlug ? getThemeBySlug(themeSlug) || null : {
      title: isPt ? 'Aconselhamento Personalizado NeoLife' : 'Personalized NeoLife Consultation',
      description: isPt
        ? 'Revisão dos seus produtos e objetivos de saúde e negócio com os nossos mentores.'
        : 'Review your selected products and wellness/business goals with our mentors.',
      slug: 'consulta-geral',
    }
  );

  useEffect(() => {
    if (themeSlug) {
      fetch(`/api/themes?slug=${encodeURIComponent(themeSlug)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.slug) {
            setTheme(data);
          }
        })
        .catch(() => {});
    }
  }, [themeSlug]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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

  // Compile detailed notes including all selections
  const buildCompiledNotes = (): string => {
    const lines: string[] = [];

    if (selectedHealthPacks.length > 0) {
      lines.push(`🌿 PACOTES DE SAÚDE SELECIONADOS:`);
      selectedHealthPacks.forEach((p, idx) => {
        lines.push(`  ${idx + 1}. ${p.title} (${p.category})`);
      });
    }

    if (customHealthNeed.trim()) {
      lines.push(`\n📝 OUTRAS NECESSIDADES DE SAÚDE ESPECIFICADAS:`);
      lines.push(`  "${customHealthNeed.trim()}"`);
    }

    if (businessGoals.length > 0) {
      lines.push(`\n💼 METAS DE NEGÓCIO DE INTERESSE:`);
      businessGoals.forEach((g) => lines.push(`  • ${g}`));
    }

    if (experienceInterests.length > 0) {
      lines.push(`\n✈️ EXPERIÊNCIAS / ESTILO DE VIDA:`);
      experienceInterests.forEach((e) => lines.push(`  • ${e}`));
    }

    if (formData.notes.trim()) {
      lines.push(`\n💬 OBSERVAÇÕES DO CLIENTE:`);
      lines.push(`  ${formData.notes.trim()}`);
    }

    return lines.join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const compiledNotes = buildCompiledNotes();

    try {
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
          whatsapp: formData.whatsapp || undefined,
          theme: theme?.slug || 'consulta-personalizada',
          source: formData.source || 'website-selecao',
          campaign: campaign || undefined,
          notes: compiledNotes || undefined,
        }),
      });

      if (response.ok) {
        clearAllSelections();
        setSubmitSuccess(true);
        setTimeout(() => {
          window.location.href = '/confirmacao';
        }, 1200);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao submeter formulário. Por favor, tente novamente.');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Erro ao enviar formulário. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppDirectUrl = () => {
    const compiled = buildCompiledNotes();
    const text = isPt
      ? `Olá José e Ofélia! Submeti o meu interesse na NeoLife:\n\n👤 Nome: ${formData.name || '(Novo Contacto)'}\n📞 Telefone: ${formData.phone || ''}\n\n${compiled}`
      : `Hello José & Ofélia! I have submitted my interest in NeoLife:\n\n👤 Name: ${formData.name || '(New Lead)'}\n\n${compiled}`;
    return `https://wa.me/258823056900?text=${encodeURIComponent(text)}`;
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
            {isPt ? 'Pedido Enviado com Sucesso!' : 'Request Sent Successfully!'}
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            {isPt
              ? 'Recebemos a sua seleção e entraremos em contacto brevemente.'
              : 'We have received your selection and will be in touch shortly.'}
          </p>
          <a
            href={getWhatsAppDirectUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md"
          >
            {isPt ? 'Falar Agora no WhatsApp ➔' : 'Chat Now on WhatsApp ➔'}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-bold mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            {isPt ? 'Formulário de Aconselhamento & Encomenda' : 'Consultation & Order Form'}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {theme?.title || 'Aconselhamento Personalizado NeoLife'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            {isPt
              ? 'Confirme a sua seleção abaixo e indique os seus contactos para receber aconselhamento direto e detalhes de entrega.'
              : 'Review your selection below and share your contact details for personalized guidance and delivery.'}
          </p>
        </div>

        {/* ── CARD RESUMO DA SELEÇÃO (Cesto Automático) ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🛒</span>
              <div>
                <h2 className="font-extrabold text-gray-900 text-base sm:text-lg">
                  {isPt ? 'Resumo da Sua Seleção' : 'Your Selection Summary'}
                </h2>
                <p className="text-xs text-gray-500">
                  {totalItemsCount > 0
                    ? (isPt ? `${totalItemsCount} item(s) selecionado(s)` : `${totalItemsCount} item(s) selected`)
                    : (isPt ? 'Nenhum item selecionado ainda' : 'No items selected yet')}
                </p>
              </div>
            </div>

            {totalItemsCount > 0 && (
              <button
                type="button"
                onClick={clearAllSelections}
                className="text-xs text-red-600 hover:text-red-800 font-semibold hover:underline"
              >
                {isPt ? 'Limpar Tudo' : 'Clear All'}
              </button>
            )}
          </div>

          {totalItemsCount === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {isPt ? 'Ainda não adicionou soluções ao seu pedido' : 'No solutions added to your order yet'}
              </p>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-4">
                {isPt
                  ? 'Pode preencher o formulário diretamente ou explorar as nossas áreas de Saúde e Business para selecionar produtos específicos.'
                  : 'You can submit directly or browse Health and Business to pick specific items.'}
              </p>
              <div className="flex justify-center gap-3">
                <Link href="/saude">
                  <Button size="sm" variant="outline" className="text-xs border-emerald-300 text-emerald-800 hover:bg-emerald-50">
                    {isPt ? 'Ver Saúde ➔' : 'View Health ➔'}
                  </Button>
                </Link>
                <Link href="/business">
                  <Button size="sm" variant="outline" className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100">
                    {isPt ? 'Ver Business ➔' : 'View Business ➔'}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pacotes de Saúde Selecionados */}
              {selectedHealthPacks.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    🌿 {isPt ? 'Pacotes de Saúde Escolhidos:' : 'Selected Health Packs:'}
                  </p>
                  <div className="space-y-2">
                    {selectedHealthPacks.map((pack) => (
                      <div
                        key={pack.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs"
                      >
                        <div>
                          <span className="font-bold text-gray-900">{pack.title}</span>
                          {pack.subtitle && (
                            <span className="text-gray-500 ml-2 font-mono text-[11px]">({pack.subtitle})</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeHealthPack(pack.id)}
                          className="text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50"
                          title={isPt ? 'Remover' : 'Remove'}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Necessidade Escrita em Outras Soluções */}
              {customHealthNeed.trim() && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-900">
                      📝 {isPt ? 'Pedido / Necessidade Especial:' : 'Special Request:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCustomHealthNeed('')}
                      className="text-amber-700 hover:text-amber-900 text-[11px] font-bold"
                    >
                      ✕ {isPt ? 'Apagar' : 'Clear'}
                    </button>
                  </div>
                  <p className="text-gray-700 italic">“{customHealthNeed}”</p>
                </div>
              )}

              {/* Metas de Negócio */}
              {businessGoals.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                    💼 {isPt ? 'Objetivos de Negócio:' : 'Business Goals:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {businessGoals.map((goal, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-300"
                      >
                        <span>{goal}</span>
                        <button
                          type="button"
                          onClick={() => toggleBusinessGoal(goal)}
                          className="text-gray-400 hover:text-red-600 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experiências */}
              {experienceInterests.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2">
                    ✈️ {isPt ? 'Interesse em Experiências:' : 'Experience Interests:'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experienceInterests.map((exp, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-900 border border-teal-200"
                      >
                        <span>{exp}</span>
                        <button
                          type="button"
                          onClick={() => toggleExperienceInterest(exp)}
                          className="text-teal-400 hover:text-red-600 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── FORMULÁRIO DE CONTACTO ── */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
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

            {/* Phone */}
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

            <Select
              label={isPt ? 'Como conheceu a NeoLife? (Opcional)' : 'How did you hear about NeoLife? (Optional)'}
              name="source"
              value={formData.source}
              onChange={handleInputChange}
            >
              <option value="">{isPt ? 'Selecione uma opção' : 'Select an option'}</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="amigo">{isPt ? 'Amigo / Indicação' : 'Friend / Referral'}</option>
              <option value="google">Google</option>
              <option value="outro">{isPt ? 'Outro canal' : 'Other'}</option>
            </Select>

            <Textarea
              label={isPt ? 'Notas Adicionais / Mensagem Livre' : 'Additional Notes / Message'}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder={
                isPt
                  ? 'Tem alguma dúvida específica ou horário preferido para contacto?'
                  : 'Any specific questions or preferred contact time?'
              }
              rows={3}
            />

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {errors.submit}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold py-3.5 rounded-xl shadow-md text-sm"
              >
                {isSubmitting
                  ? (isPt ? 'A Enviar Pedido...' : 'Sending Request...')
                  : (isPt ? 'Submeter Pedido & Falar com a Equipa ➔' : 'Submit Request & Connect ➔')}
              </Button>
            </div>

            <div className="text-center pt-2">
              <a
                href={getWhatsAppDirectUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-800 hover:underline inline-flex items-center gap-1.5"
              >
                <span>💬</span>
                <span>{isPt ? 'Prefere enviar diretamente no WhatsApp dos mentores?' : 'Prefer to send directly via WhatsApp?'}</span>
              </a>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function FormularioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">A carregar formulário...</p>
          </div>
        </div>
      }
    >
      <FormularioContent />
    </Suspense>
  );
}