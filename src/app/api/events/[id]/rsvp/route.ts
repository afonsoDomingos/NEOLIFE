import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db, ObjectId } from 'mongodb';
import { sendAdminNotification } from '@/lib/email/resend';

let db: Db;

async function getDatabase(): Promise<Db> {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    db = client.db('neolife');
  }
  return db;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email, phone } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const collection = database.collection('eventRsvps');

    const rsvp = {
      eventId: id,
      name,
      email,
      phone,
      createdAt: new Date(),
    };

    await collection.insertOne(rsvp);

    // Fetch event details for notification
    const event = await database.collection('events').findOne({ _id: new ObjectId(id) });

    // Send admin notification
    try {
      const content = `
<h2>Nova Confirmação de Participação em Evento!</h2>
<p>Um participante confirmou presença em um evento:</p>

<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Nome:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><strong>${name}</strong></td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Email:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><a href="mailto:${email}">${email}</a></td></tr>
  ${phone ? `<tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Telefone:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${phone}</td></tr>` : ''}
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Evento:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;"><strong>${event?.title || 'N/A'}</strong></td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Data:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${event?.date ? new Date(event.date).toLocaleDateString('pt-PT') : 'N/A'}</td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Hora:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${event?.time || 'N/A'}</td></tr>
  <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px; font-weight: bold; width: 35%; color: #4b5563;">Data/Hora RSVP:</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 14px;">${new Date().toLocaleString('pt-PT')}</td></tr>
</table>
`;

      await sendAdminNotification({
        subject: `RSVP: ${name} confirmou presença em ${event?.title || 'evento'}`,
        content,
      });
    } catch (emailError) {
      console.error('Error sending admin notification for RSVP:', emailError);
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    return NextResponse.json({ error: 'Failed to create RSVP' }, { status: 500 });
  }
}
