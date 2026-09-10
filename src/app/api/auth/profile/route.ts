import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, phone, country, currentPassword, newPassword } = body;

    const member = await Member.findById(session.id);
    if (!member) {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 });
    }

    const updates: Record<string, string> = {};

    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone;
    if (country) updates.country = country;

    // Password change
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Deve fornecer a senha atual para alterar.' },
          { status: 400 }
        );
      }
      const valid = await bcrypt.compare(currentPassword, member.passwordHash);
      if (!valid) {
        return NextResponse.json(
          { error: 'Senha atual incorreta.' },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'A nova senha deve ter pelo menos 6 caracteres.' },
          { status: 400 }
        );
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 12);
    }

    await Member.findByIdAndUpdate(session.id, { $set: updates });

    return NextResponse.json({ success: true, message: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar perfil.' },
      { status: 500 }
    );
  }
}
