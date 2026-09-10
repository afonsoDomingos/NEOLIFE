import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';

export async function GET(request: NextRequest) {
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

    await connectToDatabase();

    const member = await Member.findById(session.id).select('-passwordHash');
    if (!member || member.status !== 'active') {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 401 });
    }

    return NextResponse.json({
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      phone: member.phone,
      country: member.country,
      status: member.status,
      plan: member.plan,
      referralCode: member.referralCode,
      referredBy: member.referredBy,
      lastLoginAt: member.lastLoginAt,
      createdAt: member.createdAt,
    });
  } catch (error) {
    console.error('Me error:', error);
    return NextResponse.json({ error: 'Erro ao obter dados.' }, { status: 500 });
  }
}
