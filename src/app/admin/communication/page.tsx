'use client';

import { useState } from 'react';
import { emailTemplates, getTemplateById } from '@/lib/email/templates';

export default function CommunicationPage() {
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [targetGroup, setTargetGroup] = useState('');
  const [sendToAll, setSendToAll] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = getTemplateById(templateId);
    if (template) {
      setSubject(template.subject);
      setContent(template.content);
    }
  };

  const handleSend = async () => {
    if (!subject || !content) {
      alert('Por favor, preencha o assunto e o conteúdo do email.');
      return;
    }

    if (!confirm(`Tem certeza que deseja enviar este email para ${sendToAll ? 'todos os leads' : 'leads do grupo ' + targetGroup}?`)) {
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
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ success: true, message: data.message });
        setSubject('');
        setContent('');
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
                  onChange={() => setSendToAll(true)}
                  name="target"
                />
                <span>Todos os leads</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!sendToAll}
                  onChange={() => setSendToAll(false)}
                  name="target"
                />
                <span>Grupo específico (tema)</span>
              </label>
              {!sendToAll && (
                <input
                  type="text"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full p-2 border rounded ml-6"
                  placeholder="Nome do tema (ex: conheca-neolife)"
                />
              )}
            </div>
          </div>

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
