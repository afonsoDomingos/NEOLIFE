import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const member = await Member.findOne({ email: email.toLowerCase().trim() });

    if (!member) {
      return NextResponse.json(
        { error: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    if (member.status === 'suspended') {
      return NextResponse.json(
        { error: 'A sua conta foi suspensa. Contacte o suporte.' },
        { status: 403 }
      );
    }

    if (member.status === 'pending') {
      return NextResponse.json(
        { error: 'A sua conta está a aguardar aprovação.' },
        { status: 403 }
      );
    }

    const passwordValid = await bcrypt.compare(password, member.passwordHash);
    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Credenciais inválidas.' },
        { status: 401 }
      );
    }

    // Update last login
    await Member.findByIdAndUpdate(member._id, { lastLoginAt: new Date() });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(
      'member_session',
      JSON.stringify({ id: member._id.toString(), email: member.email }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      }
    );

    return NextResponse.json({
      success: true,
      member: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        plan: member.plan,
        referralCode: member.referralCode,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login. Tente novamente.' },
      { status: 500 }
    );
  }
}
