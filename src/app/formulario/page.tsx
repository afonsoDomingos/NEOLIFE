'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import { getCountryById } from '@/data/countries';
import { getThemeBySlug } from '@/data/themes';
import Link from 'next/link';

function FormularioContent() {
  const searchParams = useSearchParams();
  const themeSlug = searchParams.get('tema');
  const countryId = searchParams.get('pais');
  const campaign = searchParams.get('campanha');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
    source: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const theme = themeSlug ? getThemeBySlug(themeSlug) : null;
  const country = countryId ? getCountryById(countryId) : null;

  useEffect(() => {
    if (!theme || !country) {
      window.location.href = '/';
    }
  }, [theme, country]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: countryId,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp || undefined,
          theme: themeSlug,
          source: formData.source || undefined,
          campaign: campaign || undefined,
          notes: formData.notes || undefined
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        // Redirect to confirmation page after a short delay
        setTimeout(() => {
          window.location.href = '/confirmacao';
        }, 1500);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Erro ao enviar formulário. Por favor, tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!theme || !country) {
    return null;
  }

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">
            Formulário Enviado!
          </h2>
          <p className="text-gray-600">
            A redirecionar para a página de confirmação...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
            {theme.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Preencha os seus dados para receber informações personalizadas.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="font-medium">{country.flag} {country.name}</span>
          </div>
          <div className="inline-block bg-gray-100 px-4 py-2 rounded-lg mt-4">
            <span className="text-sm text-gray-700">
              Passo 2 de 2: Preencher Formulário
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome Completo"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Digite o seu nome completo"
            error={errors.name}
            required
          />

          <Input
            label="Telefone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Digite o seu número de telefone"
            error={errors.phone}
            required
          />

          <Input
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Digite o seu e-mail"
            error={errors.email}
            required
          />

          <Input
            label="WhatsApp (Opcional)"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder="Digite o seu número de WhatsApp"
          />

          <Select
            label="Como conheceu a NeoLife? (Opcional)"
            name="source"
            value={formData.source}
            onChange={handleInputChange}
          >
            <option value="">Selecione uma opção</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="youtube">YouTube</option>
            <option value="google">Google</option>
            <option value="amigo">Amigo/Familiar</option>
            <option value="outro">Outro</option>
          </Select>

          <Textarea
            label="Observações (Opcional)"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Alguma informação adicional que gostaria de partilhar?"
            rows={4}
          />

          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={`/interesse?tema=${themeSlug}${campaign ? `&campanha=${campaign}` : ''}`}>
              <Button variant="outline" fullWidth>
                Voltar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? 'A Enviar...' : 'Receber Informações'}
            </Button>
          </div>
        </form>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Os seus dados estão seguros e não serão partilhados com terceiros.
          </p>
          <div className="flex justify-center gap-6 text-gray-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">A carregar...</p>
        </div>
      </div>
    }>
      <FormularioContent />
    </Suspense>
  );
}