'use client';

import { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  platform: string;
  meetingId?: string;
  passcode?: string;
  link: string;
}

export default function EventCard() {
  const [event, setEvent] = useState<Event | null>(null);
  const [visible, setVisible] = useState(false);
  const [showRsvpForm, setShowRsvpForm] = useState(false);
  const [rsvpData, setRsvpData] = useState({ name: '', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNextEvent();
  }, []);

  const fetchNextEvent = async () => {
    try {
      const response = await fetch('/api/events/next');
      const data = await response.json();
      if (data && data._id) {
        setEvent(data);
        // Show card after 3 seconds
        setTimeout(() => setVisible(true), 3000);
        // Hide after 5 seconds of being visible
        setTimeout(() => setVisible(false), 8000);
      }
    } catch (error) {
      console.error('Error fetching next event:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isPastEvent = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/events/${event._id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpData),
      });

      if (response.ok) {
        alert('Confirmação enviada com sucesso!');
        setShowRsvpForm(false);
        setRsvpData({ name: '', email: '', phone: '' });
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
      alert('Erro ao enviar confirmação. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!event || !visible) return null;

  const isPast = isPastEvent(event.date);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        maxWidth: '350px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        zIndex: 1000,
        border: '1px solid #e5e7eb',
      }}
    >
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
              {isPast ? 'EVENTO PASSADO' : 'PRÓXIMO EVENTO'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b' }}>
              {event.title}
            </div>
          </div>
          <button
            onClick={() => setVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#64748b',
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>

        <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px', lineHeight: '1.5' }}>
          <div style={{ marginBottom: '4px' }}>🗓️ Data: {formatDate(event.date)}</div>
          <div style={{ marginBottom: '4px' }}>⏰ Hora: {event.time}</div>
          <div style={{ marginBottom: '4px' }}>💻 Online — {event.platform}</div>
          {event.meetingId && <div style={{ marginBottom: '4px' }}>📌 Meeting ID: {event.meetingId}</div>}
          {event.passcode && <div style={{ marginBottom: '4px' }}>🔑 Passcode: {event.passcode}</div>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              textAlign: 'center',
              padding: '10px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            🔗 Entrar no Evento
          </a>

          {!isPast && (
            <button
              onClick={() => setShowRsvpForm(!showRsvpForm)}
              style={{
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #10b981',
                background: 'white',
                color: '#10b981',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {showRsvpForm ? 'Cancelar' : '✅ Confirmar Participação'}
            </button>
          )}
        </div>

        {showRsvpForm && !isPast && (
          <form onSubmit={handleRsvpSubmit} style={{ marginTop: '12px' }}>
            <input
              type="text"
              placeholder="Seu nome"
              value={rsvpData.name}
              onChange={(e) => setRsvpData({ ...rsvpData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '8px',
                fontSize: '13px',
              }}
            />
            <input
              type="email"
              placeholder="Seu email"
              value={rsvpData.email}
              onChange={(e) => setRsvpData({ ...rsvpData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '8px',
                fontSize: '13px',
              }}
            />
            <input
              type="tel"
              placeholder="Telefone (opcional)"
              value={rsvpData.phone}
              onChange={(e) => setRsvpData({ ...rsvpData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                marginBottom: '8px',
                fontSize: '13px',
              }}
            />
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                fontSize: '13px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Enviando...' : 'Confirmar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
