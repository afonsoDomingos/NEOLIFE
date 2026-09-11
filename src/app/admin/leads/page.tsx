'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select, Textarea } from '@/components/ui/Input';
import Link from 'next/link';
import { LeadStatus } from '@/types';
import { getCountryById } from '@/data/countries';

interface MongoLead {
  _id: string;
  country: string;
  name: string;
  phone: string;
  email: string;
  theme: string;
  whatsapp?: string;
  source?: string;
  campaign?: string;
  notes?: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<MongoLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<MongoLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<MongoLead | null>(null);
  
  // Copy state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Email Composer state
  const [emailModalLead, setEmailModalLead] = useState<MongoLead | null>(null);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // WhatsApp template selection
  const [waTemplate, setWaTemplate] = useState<'geral' | 'saude' | 'renda' | 'experiencias'>('geral');

  const [filters, setFilters] = useState({
    search: '',
    country: '',
    theme: '',
    status: ''
  });

  useEffect(() => {
    loadLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  const loadLeads = async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
        setFilteredLeads(data);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.phone.includes(search)
      );
    }

    if (filters.country) {
      filtered = filtered.filter(lead => lead.country === filters.country);
    }

    if (filters.theme) {
      filtered = filtered.filter(lead => lead.theme === filters.theme);
    }

    if (filters.status) {
      filtered = filtered.filter(lead => lead.status === filters.status);
    }

    setFilteredLeads(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    applyFilters();
  };

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        loadLeads();
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const deleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`Tem a certeza que deseja apagar o lead "${leadName}"? Esta ação é irreversível.`)) return;
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, { method: 'DELETE' });
      if (response.ok) {
        loadLeads();
        if (selectedLead && selectedLead._id === leadId) {
          setSelectedLead(null);
        }
      } else {
        alert('Erro ao apagar lead. Por favor, tente novamente.');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Erro ao apagar lead.');
    }
  };

  const copyToClipboard = (text: string, identifier: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(identifier);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const cleanPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const getWhatsAppMessage = (lead: MongoLead, template: 'geral' | 'saude' | 'renda' | 'experiencias') => {
    const name = lead.name.split(' ')[0] || lead.name;
    switch (template) {
      case 'saude':
        return `Olá ${name}! Sou da equipa de mentoria de Ofélia & José Machado na NeoLife. Vimos o seu interesse em elevar a sua saúde e nutrição celular. Gostaria de saber como posso ajudá-lo(a) hoje?`;
      case 'renda':
        return `Olá ${name}! Sou da equipa de mentoria de Ofélia & José Machado na NeoLife. Recebemos o seu contacto sobre a Oportunidade de Negócio e Liberdade Financeira. Está disponível para falarmos brevemente?`;
      case 'experiencias':
        return `Olá ${name}! Sou da equipa de mentoria de Ofélia & José Machado na NeoLife. Vimos o seu interesse em novas experiências, viagens e desenvolvimento pessoal connosco. Como podemos ajudá-lo(a)?`;
      default:
        return `Olá ${name}! Sou da equipa de mentoria de Ofélia & José Machado na NeoLife África. Recebemos o seu pedido de contacto pelo nosso website e estou aqui para esclarecer qualquer dúvida com todo o gosto!`;
    }
  };

  const openEmailModal = (lead: MongoLead) => {
    setEmailModalLead(lead);
    setEmailSubject(`NeoLife África • Olá ${lead.name.split(' ')[0]}, estamos aqui para ajudar!`);
    setEmailMessage(`Olá ${lead.name},\n\nObrigado pelo seu interesse através do nosso website da NeoLife África.\n\nSomos o José e a Ofélia Machado e queremos acompanhá-lo(a) na sua jornada. Ficamos inteiramente à sua disposição para responder a quaisquer dúvidas ou agendar uma conversa direta sem compromisso.\n\nQual o melhor horário para conversarmos por WhatsApp ou telefone?\n\nCom os melhores cumprimentos,\nJosé Sarmento Machado & Ofélia Alfredo Machado\nNeoLife África`);
    setEmailFeedback(null);
  };

  const applyEmailTemplate = (type: 'saude' | 'renda' | 'boas-vindas') => {
    if (!emailModalLead) return;
    const name = emailModalLead.name.split(' ')[0] || emailModalLead.name;

    if (type === 'saude') {
      setEmailSubject(`Nutrição Celular & Saúde • NeoLife África`);
      setEmailMessage(`Olá ${name},\n\nRecebemos o seu contacto com interesse em saber mais sobre Nutrição Celular e a gama de produtos NeoLife.\n\nOs nossos suplementos contam com mais de 60 anos de validação científica para elevar a vitalidade e imunidade de toda a família. Gostaríamos de lhe enviar informações detalhadas ou esclarecer os seus objetivos de saúde.\n\nComo prefere receber mais detalhes?\n\nCom amizade,\nOfélia & José Machado`);
    } else if (type === 'renda') {
      setEmailSubject(`Oportunidade de Negócio & Liberdade • NeoLife África`);
      setEmailMessage(`Olá ${name},\n\nFicamos muito entusiasmados com o seu interesse em conhecer o nosso modelo de negócio independente NeoLife.\n\nTrabalhamos com mentoria próxima, permitindo criar uma nova fonte de renda sustentável em Moçambique, África do Sul, Angola e Zimbabwe com horários flexíveis.\n\nPodemos marcar uma chamada rápida para lhe apresentar os passos práticos?\n\nUm abraço,\nJosé & Ofélia Machado`);
    } else {
      setEmailSubject(`NeoLife África • Bem-vindo(a) à nossa equipa!`);
      setEmailMessage(`Olá ${name},\n\nObrigado por se conectar connosco na NeoLife África.\n\nA nossa missão é partilhar saúde genuína e liberdade financeira com quem deseja transformar o seu futuro. Estamos prontos para caminhar ao seu lado.\n\nAtenciosamente,\nOfélia Alfredo Machado & José Sarmento Machado`);
    }
  };

  const handleSendDirectEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailModalLead) return;

    setSendingEmail(true);
    setEmailFeedback(null);

    try {
      const response = await fetch('/api/admin/leads/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailModalLead.email,
          leadName: emailModalLead.name,
          subject: emailSubject,
          message: emailMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailFeedback({
          type: 'success',
          message: data.simulated 
            ? 'E-mail registado com sucesso! (Modo Simulação configurado)'
            : 'E-mail enviado com sucesso diretamente para a caixa de correio do lead!'
        });
        setTimeout(() => {
          setEmailModalLead(null);
        }, 2000);
      } else {
        setEmailFeedback({
          type: 'error',
          message: data.error || 'Erro ao enviar e-mail. Verifique a configuração de SMTP/Resend.'
        });
      }
    } catch (err: any) {
      setEmailFeedback({
        type: 'error',
        message: err.message || 'Erro ao comunicar com o servidor.'
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      alert('Nenhum lead para exportar.');
      return;
    }
    const headers = ['Nome Completo', 'Telefone', 'Email', 'WhatsApp', 'País', 'Tema', 'Estado', 'Origem', 'Notas', 'Data de Registo'];
    const rows = filteredLeads.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.whatsapp || '').replace(/"/g, '""')}"`,
      `"${(getCountryById(l.country)?.name || l.country || '').replace(/"/g, '""')}"`,
      `"${(l.theme || '').replace(/"/g, '""')}"`,
      `"${(getStatusLabel(l.status) || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(l.createdAt).toLocaleDateString('pt-PT')} ${new Date(l.createdAt).toLocaleTimeString('pt-PT')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_neolife_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: LeadStatus): string => {
    const colors = {
      novo: 'bg-blue-100 text-blue-800',
      contactado: 'bg-yellow-100 text-yellow-800',
      acompanhamento: 'bg-purple-100 text-purple-800',
      interessado: 'bg-green-100 text-green-800',
      convertido: 'bg-emerald-100 text-emerald-800',
      nao_interessado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: LeadStatus): string => {
    const labels = {
      novo: 'Novo',
      contactado: 'Contactado',
      acompanhamento: 'Em Acompanhamento',
      interessado: 'Interessado',
      convertido: 'Convertido',
      nao_interessado: 'Não Interessado'
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-black font-medium text-sm">
                ← Voltar ao Painel
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold text-gray-900">Gestão de Leads & Contactos</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">
                {filteredLeads.length} de {leads.length} leads
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-1.5 border-emerald-600 text-emerald-800 hover:bg-emerald-50 font-semibold text-xs"
                title="Descarregar lista de leads em formato CSV (Excel)"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6 shadow-sm border border-gray-100">
          <CardHeader className="pb-3">
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros de Pesquisa
            </h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Pesquisar por nome, email ou telefone"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />

              <Select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
              >
                <option value="">Todos os países</option>
                <option value="mz">Moçambique</option>
                <option value="za">África do Sul</option>
                <option value="ao">Angola</option>
                <option value="zw">Zimbabwe</option>
              </Select>

              <Select
                name="theme"
                value={filters.theme}
                onChange={handleFilterChange}
              >
                <option value="">Todos os temas</option>
                <option value="saude">Saúde & Nutrição Celular</option>
                <option value="liberdade-renda">Liberdade e Renda</option>
                <option value="mundo-experiencias">Mundo e Experiências</option>
                <option value="conheca-neolife">Conheça a NeoLife</option>
                <option value="produtos">Produtos</option>
                <option value="oportunidade">Oportunidade de Negócio</option>
                <option value="historias">Histórias de Sucesso</option>
              </Select>

              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">Todos os estados</option>
                <option value="novo">Novo</option>
                <option value="contactado">Contactado</option>
                <option value="acompanhamento">Em Acompanhamento</option>
                <option value="interessado">Interessado</option>
                <option value="convertido">Convertido</option>
                <option value="nao_interessado">Não Interessado</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card className="shadow-sm border border-gray-100 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Nome & Ficha
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Contactos Rápidos
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Pilar / Tema
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-600 font-medium">A carregar leads da base de dados...</p>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Nenhum lead encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const whatsappNum = lead.whatsapp || lead.phone;
                      const cleanWA = cleanPhoneForWhatsApp(whatsappNum);
                      const waUrl = `https://wa.me/${cleanWA}?text=${encodeURIComponent(getWhatsAppMessage(lead, 'geral'))}`;

                      return (
                        <tr key={lead._id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="px-5 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="text-left group flex flex-col"
                            >
                              <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 underline decoration-emerald-300">
                                {lead.name}
                              </span>
                              <span className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                                Ver detalhes completos →
                              </span>
                            </button>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            {(() => {
                              const c = getCountryById(lead.country);
                              return c
                                ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                    <span>{c.flag}</span>
                                    <span>{c.name}</span>
                                  </span>
                                : <span className="text-sm text-gray-400">{lead.country}</span>;
                            })()}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              {/* Phone and WhatsApp */}
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-semibold text-gray-800">{lead.phone}</span>
                                
                                {/* 1-Click WhatsApp Button */}
                                {cleanWA && (
                                  <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 rounded-md bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-xs flex items-center gap-1 text-[11px] font-bold px-1.5"
                                    title="Enviar mensagem rápida no WhatsApp"
                                  >
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.077-2.127-.514-1.748-.72-2.883-2.483-2.97-2.6-.088-.117-.706-.94-.706-1.792 0-.852.443-1.272.602-1.447.159-.175.347-.219.463-.219.116 0 .232.001.332.006.107.005.25.04.39.378.145.348.494 1.205.537 1.292.043.088.072.19.014.305-.058.117-.087.19-.174.291-.087.102-.183.228-.261.306-.088.087-.179.182-.077.357.102.175.454.749 1.01 1.244.717.639 1.321.836 1.509.93.188.093.298.08.41-.048.113-.128.483-.561.613-.753.13-.192.26-.16.438-.094.178.066 1.13.533 1.324.63.194.097.324.145.372.227.048.082.048.477-.096.882z" />
                                    </svg>
                                    <span>WA</span>
                                  </a>
                                )}

                                {/* Copy Phone */}
                                <button
                                  onClick={() => copyToClipboard(lead.phone, `phone-${lead._id}`)}
                                  className="p-1 text-gray-400 hover:text-gray-700 rounded transition-colors"
                                  title="Copiar Telefone"
                                >
                                  {copiedId === `phone-${lead._id}` ? (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Copiado!</span>
                                  ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  )}
                                </button>
                              </div>

                              {/* Email row with 1-click copy & send modal */}
                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <span className="truncate max-w-[150px]">{lead.email}</span>
                                
                                {/* Copy Email */}
                                <button
                                  onClick={() => copyToClipboard(lead.email, `email-${lead._id}`)}
                                  className="text-gray-400 hover:text-emerald-700"
                                  title="Copiar E-mail"
                                >
                                  {copiedId === `email-${lead._id}` ? (
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">Copiado!</span>
                                  ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  )}
                                </button>

                                {/* Quick Send Email from Panel */}
                                <button
                                  onClick={() => openEmailModal(lead)}
                                  className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
                                  title="Enviar e-mail diretamente pelo painel"
                                >
                                  ✉️ Enviar
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-xs font-semibold text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                              {lead.theme}
                            </span>
                            {lead.notes && (
                              <div className="text-xs text-gray-500 italic max-w-xs truncate mt-1" title={lead.notes}>
                                💬 &ldquo;{lead.notes}&rdquo;
                              </div>
                            )}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(lead.status)}`}>
                              {getStatusLabel(lead.status)}
                            </span>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-600 font-medium">
                              {new Date(lead.createdAt).toLocaleDateString('pt-PT')}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {new Date(lead.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1.5">
                              <Select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead._id.toString(), e.target.value as LeadStatus)}
                                className="text-xs py-1"
                              >
                                <option value="novo">Novo</option>
                                <option value="contactado">Contactado</option>
                                <option value="acompanhamento">Em Acompanhamento</option>
                                <option value="interessado">Interessado</option>
                                <option value="convertido">Convertido</option>
                                <option value="nao_interessado">Não Interessado</option>
                              </Select>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedLead(lead)}
                                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold"
                                >
                                  Ver Ficha
                                </button>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => deleteLead(lead._id.toString(), lead.name)}
                                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                  Apagar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Ficha Completa do Lead</span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{selectedLead.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Status Selector Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 border border-gray-100 mb-6">
                <div>
                  <span className="text-xs text-gray-500 block">Estado do Atendimento:</span>
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full mt-1 ${getStatusColor(selectedLead.status)}`}>
                    {getStatusLabel(selectedLead.status)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 font-medium">Alterar:</span>
                  <Select
                    value={selectedLead.status}
                    onChange={(e) => updateLeadStatus(selectedLead._id.toString(), e.target.value as LeadStatus)}
                    className="text-xs"
                  >
                    <option value="novo">Novo</option>
                    <option value="contactado">Contactado</option>
                    <option value="acompanhamento">Em Acompanhamento</option>
                    <option value="interessado">Interessado</option>
                    <option value="convertido">Convertido</option>
                    <option value="nao_interessado">Não Interessado</option>
                  </Select>
                </div>
              </div>

              {/* Direct 1-Click WhatsApp Section */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">💬</span>
                    <span className="text-sm font-bold text-emerald-950">Mandar Mensagem WhatsApp em 1-Clique</span>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold">{selectedLead.whatsapp || selectedLead.phone}</span>
                </div>

                {/* WhatsApp Template Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  {[
                    { id: 'geral', label: 'Saudação Geral' },
                    { id: 'saude', label: '1. Saúde' },
                    { id: 'renda', label: '2. Renda' },
                    { id: 'experiencias', label: '3. Experiências' },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setWaTemplate(tpl.id as any)}
                      className={`text-xs py-1.5 px-2 rounded-lg font-semibold border transition-all ${
                        waTemplate === tpl.id
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-gray-700 border-emerald-200 hover:bg-emerald-100/50'
                      }`}
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>

                <div className="p-2.5 bg-white rounded-xl text-xs text-gray-600 italic border border-emerald-100 mb-3">
                  &ldquo;{getWhatsAppMessage(selectedLead, waTemplate)}&rdquo;
                </div>

                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(selectedLead.whatsapp || selectedLead.phone)}?text=${encodeURIComponent(getWhatsAppMessage(selectedLead, waTemplate))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button fullWidth className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 shadow-sm flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.077-2.127-.514-1.748-.72-2.883-2.483-2.97-2.6-.088-.117-.706-.94-.706-1.792 0-.852.443-1.272.602-1.447.159-.175.347-.219.463-.219.116 0 .232.001.332.006.107.005.25.04.39.378.145.348.494 1.205.537 1.292.043.088.072.19.014.305-.058.117-.087.19-.174.291-.087.102-.183.228-.261.306-.088.087-.179.182-.077.357.102.175.454.749 1.01 1.244.717.639 1.321.836 1.509.93.188.093.298.08.41-.048.113-.128.483-.561.613-.753.13-.192.26-.16.438-.094.178.066 1.13.533 1.324.63.194.097.324.145.372.227.048.082.048.477-.096.882z" />
                    </svg>
                    Abrir no WhatsApp Agora
                  </Button>
                </a>
              </div>

              {/* Info Grid */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block mb-1">Telefone Principal</span>
                      <a href={`tel:${selectedLead.phone}`} className="text-sm font-bold text-gray-900 hover:text-emerald-700">
                        📞 {selectedLead.phone}
                      </a>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedLead.phone, 'modal-phone')}
                      className="px-2 py-1 rounded bg-white text-xs font-semibold border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                    >
                      {copiedId === 'modal-phone' ? '✓ Copiado!' : 'Copiar'}
                    </button>
                  </div>

                  <div className="p-3.5 bg-gray-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block mb-1">E-mail do Lead</span>
                      <span className="text-sm font-bold text-gray-900">{selectedLead.email}</span>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => copyToClipboard(selectedLead.email, 'modal-email')}
                        className="px-2 py-1 rounded bg-white text-xs font-semibold border border-gray-200 hover:bg-gray-100 text-gray-700 transition-colors"
                      >
                        {copiedId === 'modal-email' ? '✓ Copiado!' : 'Copiar'}
                      </button>
                      <button
                        onClick={() => openEmailModal(selectedLead)}
                        className="px-2 py-1 rounded bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                      >
                        ✉️ Enviar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-gray-50 rounded-2xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">País Selecionado</span>
                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{getCountryById(selectedLead.country)?.flag}</span>
                      <span>{getCountryById(selectedLead.country)?.name || selectedLead.country}</span>
                    </p>
                  </div>
                  <div className="p-3.5 bg-gray-50 rounded-2xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Pilar / Tema</span>
                    <p className="text-sm font-bold text-emerald-800 capitalize">
                      {selectedLead.theme}
                    </p>
                  </div>
                </div>

                {selectedLead.source && (
                  <div className="p-3.5 bg-gray-50 rounded-2xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Como Conheceu a NeoLife</span>
                    <p className="text-sm text-gray-800 font-medium">{selectedLead.source}</p>
                  </div>
                )}

                {selectedLead.campaign && (
                  <div className="p-3.5 bg-gray-50 rounded-2xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Campanha de Origem / UTM</span>
                    <p className="text-xs font-mono text-gray-700">{selectedLead.campaign}</p>
                  </div>
                )}

                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-900 block mb-1">Dúvidas / Observações do Lead</span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.notes || 'Nenhuma observação adicional foi deixada pelo utilizador.'}
                  </p>
                </div>

                <div className="text-xs text-gray-400 text-right">
                  Registado em: {new Date(selectedLead.createdAt).toLocaleString('pt-PT')}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Fechar Ficha
                </Button>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEmailModal(selectedLead)}
                    className="px-4 py-2 rounded-xl border border-emerald-300 text-emerald-800 font-bold text-sm hover:bg-emerald-50"
                  >
                    ✉️ Enviar E-mail
                  </button>
                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(selectedLead.whatsapp || selectedLead.phone)}?text=${encodeURIComponent(getWhatsAppMessage(selectedLead, waTemplate))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                      WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Email Composer Modal */}
        {emailModalLead && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Envio de E-mail Direto</span>
                  <h2 className="text-xl font-bold text-gray-900">Enviar E-mail para {emailModalLead.name}</h2>
                </div>
                <button
                  onClick={() => setEmailModalLead(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              {/* Quick Template Picker */}
              <div className="mb-4">
                <span className="text-xs font-semibold text-gray-500 block mb-2">Modelos Prontos:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => applyEmailTemplate('boas-vindas')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-700 font-medium"
                  >
                    👋 Boas-Vindas
                  </button>
                  <button
                    type="button"
                    onClick={() => applyEmailTemplate('saude')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-700 font-medium"
                  >
                    🌿 Saúde & Nutrição
                  </button>
                  <button
                    type="button"
                    onClick={() => applyEmailTemplate('renda')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-700 font-medium"
                  >
                    💼 Oportunidade & Renda
                  </button>
                </div>
              </div>

              <form onSubmit={handleSendDirectEmail} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Destinatário:</label>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="text-sm font-medium text-gray-800">{emailModalLead.email}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(emailModalLead.email, 'composer-email')}
                      className="text-xs text-emerald-700 font-semibold"
                    >
                      {copiedId === 'composer-email' ? '✓ Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Assunto do E-mail:</label>
                  <Input
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    required
                    placeholder="Assunto da mensagem"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mensagem:</label>
                  <Textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    required
                    rows={8}
                    placeholder="Escreva a sua mensagem aqui..."
                  />
                </div>

                {emailFeedback && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    emailFeedback.type === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {emailFeedback.message}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <a
                    href={`mailto:${emailModalLead.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`}
                    className="text-xs font-semibold text-gray-600 hover:text-emerald-700"
                  >
                    Abrir no Outlook / Gmail ↗
                  </a>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEmailModalLead(null)}
                      disabled={sendingEmail}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={sendingEmail}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      {sendingEmail ? 'A enviar...' : 'Enviar E-mail Agora'}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}