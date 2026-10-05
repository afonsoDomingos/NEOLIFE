'use client';

import { useState, useEffect } from 'react';
import { emailTemplates, getTemplateById } from '@/lib/email/templates';

export default function CommunicationPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [targetGroup, setTargetGroup] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [sendToSpecific, setSendToSpecific] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    if (sendToSpecific) {
      loadLeads();
    }
  }, [sendToSpecific]);

  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = getTemplateById(templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
    }
  };

  const handleLeadToggle = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead._id || lead.id));
    }
  };

  const handleSend = async () => {
    if (!subject || !content) {
      alert('Por favor, preencha o assunto e o conteúdo do email.');
      return;
    }

    if (sendToSpecific && selectedLeads.length === 0) {
      alert('Por favor, selecione pelo menos um lead.');
      return;
    }

    const targetDescription = sendToAll
      ? 'todos os leads'
      : sendToSpecific
      ? `${selectedLeads.length} leads selecionados`
      : 'leads do grupo ' + targetGroup;

    if (!confirm(`Tem certeza que deseja enviar este email para ${targetDescription}?`)) {
      return;
    }

    setSending(true);
    setResult(null);

    try {
      const response = await fetch('/admin/api/communication/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          content,
          targetGroup,
          sendToAll,
          sendToSpecific,
          selectedLeads,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
        setSubject('');
        setContent('');
        setSelectedLeads([]);
      } else {
        setResult({ success: false, message: data.error || 'Erro ao enviar email' });
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setResult({ success: false, message: 'Erro ao enviar email' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Comunicação com Leads</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Novo Email</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Modelo (opcional)</label>
            <select
              value={selectedTemplate}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione um modelo...</option>
              {emailTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Assunto</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Assunto do email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows={10}
              placeholder="Conteúdo do email (pode usar HTML)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Enviar para</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={sendToAll}
                  onChange={() => { setSendToAll(true); setSendToSpecific(false); }}
                  name="target"
                />
                <span>Todos os leads</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!sendToAll && !sendToSpecific}
                  onChange={() => { setSendToAll(false); setSendToSpecific(false); }}
                  name="target"
                />
                <span>Grupo específico (tema)</span>
              </label>
              {!sendToAll && !sendToSpecific && (
                <input
                  type="text"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full p-2 border rounded ml-6"
                  placeholder="Nome do tema (ex: conheca-neolife)"
                />
              )}
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={sendToSpecific}
                  onChange={() => { setSendToAll(false); setSendToSpecific(true); }}
                  name="target"
                />
                <span>Leads específicos (selecionar da lista)</span>
              </label>
            </div>
          </div>

          {sendToSpecific && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Selecionar Leads</label>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  {selectedLeads.length === leads.length ? 'Desmarcar todos' : 'Selecionar todos'}
                </button>
              </div>
              {loadingLeads ? (
                <div className="text-sm text-gray-500">Carregando leads...</div>
              ) : (
                <div className="border rounded max-h-60 overflow-y-auto">
                  {leads.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500">Nenhum lead encontrado</div>
                  ) : (
                    leads.map((lead) => (
                      <label
                        key={lead._id || lead.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead._id || lead.id)}
                          onChange={() => handleLeadToggle(lead._id || lead.id)}
                        />
                        <div className="flex-1 text-sm">
                          <div className="font-medium">{lead.name || 'Sem nome'}</div>
                          <div className="text-gray-500">{lead.email}</div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {selectedLeads.length} lead(s) selecionado(s)
              </div>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {sending ? 'Enviando...' : 'Enviar Email'}
          </button>
        </div>
      </div>

      {result && (
        <div
          className={`p-4 rounded-lg ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-bold mb-2">⚠️ Configuração Necessária</h3>
        <p className="text-sm">
          Para usar o envio de emails, configure as seguintes variáveis de ambiente:
        </p>
        <ul className="list-disc list-inside text-sm mt-2">
          <li><code>RESEND_API_KEY</code> - Chave API do Resend</li>
          <li><code>RESEND_FROM_EMAIL</code> - Email remetente (opcional)</li>
        </ul>
      </div>
    </div>
  );
}
