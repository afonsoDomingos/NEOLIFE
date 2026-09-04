import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db/leads';
import { trackLeadGenerated } from '@/lib/utils/tracking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { country, name, phone, email, whatsapp, theme, source, campaign, notes } = body;

    // Validate required fields
    if (!country || !name || !phone || !email || !theme) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: país, nome, telefone, email e tema' },
        { status: 400 }
      );
    }

    // Create lead
    const lead = createLead({
      country,
      name,
      phone,
      email,
      whatsapp,
      theme,
      source,
      campaign,
      notes
    });

    // Track lead generation
    trackLeadGenerated({
      theme,
      country,
      campaign
    });

    // Here you would typically:
    // 1. Send automated email/WhatsApp with content
    // 2. Send notification to admin
    // 3. Track conversion in analytics
    
    return NextResponse.json(
      { success: true, leadId: lead.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Erro ao criar lead' },
      { status: 500 }
    );
  }
}