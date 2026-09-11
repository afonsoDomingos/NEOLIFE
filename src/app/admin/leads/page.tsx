'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
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

  const cleanPhoneForWhatsApp = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-black">
                ← Voltar
              </Link>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-bold text-black">Gestão de Leads</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredLeads.length} de {leads.length} leads
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={exportToCSV}
                className="flex items-center gap-1.5 border-emerald-500 text-emerald-700 hover:bg-emerald-50 font-medium text-xs"
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
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold text-black">Filtros</h2>
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
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome / Detalhes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tema Escolhido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-3"></div>
                        <p className="text-sm text-gray-600">A carregar leads da base de dados...</p>
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Nenhum lead encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const whatsappNum = lead.whatsapp || lead.phone;
                      const cleanWA = cleanPhoneForWhatsApp(whatsappNum);

                      return (
                        <tr key={lead._id} className="hover:bg-emerald-50/40 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="text-left group flex flex-col"
                            >
                              <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 underline decoration-emerald-300">
                                {lead.name}
                              </span>
                              <span className="text-xs text-emerald-600 font-medium mt-0.5">
                                Ver ficha completa →
                              </span>
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-800">{lead.phone}</span>
                              {cleanWA && (
                                <a
                                  href={`https://wa.me/${cleanWA}?text=Olá%20${encodeURIComponent(lead.name)},%20sou%20da%20NeoLife.%20Recebemos%20o%20seu%20interesse%20e%20estou%20aqui%20para%20ajudar!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                                  title="Abrir conversa no WhatsApp"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.077-2.127-.514-1.748-.72-2.883-2.483-2.97-2.6-.088-.117-.706-.94-.706-1.792 0-.852.443-1.272.602-1.447.159-.175.347-.219.463-.219.116 0 .232.001.332.006.107.005.25.04.39.378.145.348.494 1.205.537 1.292.043.088.072.19.014.305-.058.117-.087.19-.174.291-.087.102-.183.228-.261.306-.088.087-.179.182-.077.357.102.175.454.749 1.01 1.244.717.639 1.321.836 1.509.93.188.093.298.08.41-.048.113-.128.483-.561.613-.753.13-.192.26-.16.438-.094.178.066 1.13.533 1.324.63.194.097.324.145.372.227.048.082.048.477-.096.882z" />
                                  </svg>
                                </a>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{lead.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
                              {lead.theme}
                            </span>
                            {lead.notes && (
                              <div className="text-xs text-gray-500 italic max-w-xs truncate mt-1" title={lead.notes}>
                                💬 &ldquo;{lead.notes}&rdquo;
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getStatusColor(lead.status)}`}>
                              {getStatusLabel(lead.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-xs text-gray-600 font-medium">
                              {new Date(lead.createdAt).toLocaleDateString('pt-PT')}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {new Date(lead.createdAt).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
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
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Ficha Completa do Lead</span>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLead.name}</h2>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 mb-6">
                <div>
                  <span className="text-xs text-gray-500">Estado Atual:</span>
                  <p className="text-sm font-bold text-gray-800">{getStatusLabel(selectedLead.status)}</p>
                </div>
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

              {/* Info Grid */}
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Telefone Principal</span>
                    <a href={`tel:${selectedLead.phone}`} className="text-sm font-bold text-emerald-700 hover:underline">
                      📞 {selectedLead.phone}
                    </a>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">WhatsApp</span>
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(selectedLead.whatsapp || selectedLead.phone)}?text=Olá%20${encodeURIComponent(selectedLead.name)},%20sou%20da%20NeoLife.%20Recebemos%20o%20seu%20contacto!`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      💬 {selectedLead.whatsapp || selectedLead.phone}
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl">
                  <span className="text-xs font-semibold text-gray-500 block mb-1">E-mail</span>
                  <a href={`mailto:${selectedLead.email}`} className="text-sm font-medium text-gray-800 hover:text-emerald-700">
                    ✉️ {selectedLead.email}
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">País</span>
                    <p className="text-sm font-bold text-gray-800">
                      {getCountryById(selectedLead.country)?.flag} {getCountryById(selectedLead.country)?.name || selectedLead.country}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Tema Escolhido</span>
                    <p className="text-sm font-bold text-emerald-800 capitalize">
                      {selectedLead.theme}
                    </p>
                  </div>
                </div>

                {selectedLead.source && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Como Conheceu a NeoLife</span>
                    <p className="text-sm text-gray-800 font-medium">{selectedLead.source}</p>
                  </div>
                )}

                {selectedLead.campaign && (
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500 block mb-1">Campanha / UTM</span>
                    <p className="text-xs font-mono text-gray-700">{selectedLead.campaign}</p>
                  </div>
                )}

                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-800 block mb-1">Mensagem / Observações do Lead</span>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {selectedLead.notes || 'Sem observações adicionais deixadas pelo lead.'}
                  </p>
                </div>

                <div className="text-xs text-gray-400 text-right">
                  Registado em: {new Date(selectedLead.createdAt).toLocaleString('pt-PT')}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(selectedLead.whatsapp || selectedLead.phone)}?text=Olá%20${encodeURIComponent(selectedLead.name)},%20sou%20da%20NeoLife.%20Recebemos%20o%20seu%20contacto!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button fullWidth className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    Abrir WhatsApp
                  </Button>
                </a>
                <Button variant="outline" onClick={() => setSelectedLead(null)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}