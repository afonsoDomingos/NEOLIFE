import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';
import Lead from '@/lib/db/models/Lead';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('member_session');

    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    let session: { id: string; email: string };
    try {
      session = JSON.parse(sessionCookie.value);
    } catch {
      return NextResponse.json({ error: 'Sessão inválida.' }, { status: 401 });
    }

    await connectDB();

    const member = await Member.findById(session.id).select('email status');
    if (!member || member.status !== 'active') {
      return NextResponse.json({ error: 'Membro inativo ou não encontrado.' }, { status: 401 });
    }

    // Find corresponding lead in CRM by email
    const lead = await Lead.findOne({
      email: member.email.toLowerCase().trim(),
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!lead) {
      return NextResponse.json({ lead: null });
    }

    return NextResponse.json({
      lead: {
        id: (lead as any)._id.toString(),
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        country: lead.country,
        theme: lead.theme,
        status: lead.status,
        notes: lead.notes || '',
        updatedAt: lead.updatedAt,
        createdAt: lead.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching member lead status:', error);
    return NextResponse.json({ error: 'Erro ao obter estado do percurso.' }, { status: 500 });
  }
}
