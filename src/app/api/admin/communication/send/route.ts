import { NextRequest, NextResponse } from 'next/server';
import { sendBulkEmail } from '@/lib/email/resend';
import { MongoClient, Db, ObjectId } from 'mongodb';

let db: Db;

async function getDatabase(): Promise<Db> {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    db = client.db('neolife');
  }
  return db;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, content, targetGroup, sendToAll, sendToSpecific, selectedLeads } = body;

    console.log('[COMMUNICATION SEND] Request received:', { subject, sendToAll, sendToSpecific, targetGroup, selectedLeadsCount: selectedLeads?.length });

    if (!subject || !content) {
      return NextResponse.json(
        { error: 'subject and content are required' },
        { status: 400 }
      );
    }

    const database = await getDatabase();
    const leadsCollection = database.collection('leads');

    let leads = [];
    if (sendToSpecific && selectedLeads && selectedLeads.length > 0) {
      // Get specific leads by IDs
      console.log('[COMMUNICATION SEND] Fetching specific leads by IDs:', selectedLeads);
      leads = await leadsCollection.find({
        _id: { $in: selectedLeads.map((id: string) => {
          try {
            return new ObjectId(id);
          } catch {
            return id;
          }
        })}
      }).toArray();
    } else if (sendToAll) {
      console.log('[COMMUNICATION SEND] Fetching all leads');
      leads = await leadsCollection.find({}).toArray();
    } else if (targetGroup) {
      console.log('[COMMUNICATION SEND] Fetching leads by theme:', targetGroup);
      leads = await leadsCollection.find({ theme: targetGroup }).toArray();
    } else {
      console.log('[COMMUNICATION SEND] Fetching first 100 leads');
      leads = await leadsCollection.find({}).limit(100).toArray();
    }

    console.log('[COMMUNICATION SEND] Leads found:', leads.length);

    if (leads.length === 0) {
      console.log('[COMMUNICATION SEND] No leads found - returning error');
      return NextResponse.json(
        { error: 'No leads found in database. Please add leads first.' },
        { status: 404 }
      );
    }

    const emails = leads
      .map((lead: any) => lead.email)
      .filter((email: string) => email && email.includes('@'));

    console.log('[COMMUNICATION SEND] Valid emails found:', emails.length);

    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'No valid email addresses found among leads' },
        { status: 404 }
      );
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">NeoLife</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Ofélia & José Machado</p>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          ${content.replace(/\n/g, '<br>')}
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
          <p>Para deixar de receber estes emails, responda com "Remover"</p>
          <p>&copy; ${new Date().getFullYear()} NeoLife. Todos os direitos reservados.</p>
        </div>
      </body>
      </html>
    `;

    console.log('[COMMUNICATION SEND] Sending bulk email to', emails.length, 'recipients');
    const result = await sendBulkEmail({
      to: emails,
      subject,
      html,
    });

    if (result.success) {
      console.log('[COMMUNICATION SEND] Email sent successfully');
      return NextResponse.json({
        success: true,
        sentTo: emails.length,
        message: `Email enviado para ${emails.length} leads`,
      });
    } else {
      console.log('[COMMUNICATION SEND] Email send failed:', result.error);
      return NextResponse.json(
        { error: 'Failed to send emails', details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[COMMUNICATION SEND] Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
