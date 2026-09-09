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
      if (response.ok) loadLeads();
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
                <option value="conheca-neolife">Conheça a NeoLife</option>
                <option value="como-funciona">Como Funciona</option>
                <option value="produtos">Produtos</option>
                <option value="oportunidade">Oportunidade de Negócio</option>
                <option value="beneficios">Benefícios</option>
                <option value="como-comecar">Como Começar</option>
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
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tema
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado / Apagar
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
                    filteredLeads.map((lead) => (
                      <tr key={lead._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-black">{lead.name}</div>
                          {lead.whatsapp && <div className="text-xs text-emerald-600">WA: {lead.whatsapp}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(() => {
                            const c = getCountryById(lead.country);
                            return c
                              ? <div className="text-sm font-medium text-gray-700">{c.name}</div>
                              : <div className="text-sm text-gray-400">{lead.country}</div>;
                          })()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{lead.phone}</div>
                          <div className="text-xs text-gray-400">{lead.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{lead.theme}</div>
                          {lead.source && <div className="text-xs text-gray-400">via {lead.source}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                            {getStatusLabel(lead.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {new Date(lead.createdAt).toLocaleDateString('pt-PT')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-2">
                            <Select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead._id.toString(), e.target.value as LeadStatus)}
                              className="text-sm"
                            >
                              <option value="novo">Novo</option>
                              <option value="contactado">Contactado</option>
                              <option value="acompanhamento">Em Acompanhamento</option>
                              <option value="interessado">Interessado</option>
                              <option value="convertido">Convertido</option>
                              <option value="nao_interessado">Não Interessado</option>
                            </Select>
                            <button
                              onClick={() => deleteLead(lead._id.toString(), lead.name)}
                              className="text-xs text-red-500 hover:text-red-700 hover:underline text-left transition-colors font-medium"
                            >
                              Apagar Lead
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}