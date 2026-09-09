import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db/leads-mongodb';
import { getThemeBySlug } from '@/lib/db/themes-mongodb';
import { getThemeBySlug as getStaticThemeBySlug } from '@/data/themes';
import { getCountryById } from '@/data/countries';
import { trackLeadGenerated } from '@/lib/utils/tracking';
import { sendLeadConfirmationEmail, sendAdminNotificationEmail } from '@/lib/utils/email';

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

    // Create lead in MongoDB
    const lead = await createLead({
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

    // Send automated email to the lead and notification to the admin
    try {
      const dbTheme = await getThemeBySlug(theme).catch(() => null);
      const staticTheme = getStaticThemeBySlug(theme);
      const matchedTheme = dbTheme || staticTheme;
      const matchedCountry = getCountryById(country);

      // Automated email to lead with video link
      await sendLeadConfirmationEmail({
        name,
        email,
        countryName: matchedCountry?.name || country,
        themeTitle: matchedTheme?.title || theme,
        themeSlug: matchedTheme?.slug || theme,
        videoUrl: matchedTheme?.videoUrl,
      });

      // Automated notification to site administrator
      await sendAdminNotificationEmail({
        name,
        email,
        phone,
        whatsapp,
        country: matchedCountry?.name || country,
        theme: matchedTheme?.title || theme,
        campaign,
        notes,
      });
    } catch (emailError) {
      console.error('Error sending automated emails (lead was successfully saved):', emailError);
    }
    
    return NextResponse.json(
      { success: true, leadId: lead._id.toString() },
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