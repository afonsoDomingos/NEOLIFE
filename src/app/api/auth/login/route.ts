import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';
import bcrypt from 'bcryptjs';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email/Utilizador e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const cleanInput = (email || '').trim().toLowerCase();

    // ── Check if Admin credentials are used ─────────────────────────
    const isAdminIdentifier =
      cleanInput === ADMIN_USERNAME.toLowerCase() ||
      cleanInput === 'admin' ||
      cleanInput === 'admin@neolife.com' ||
      cleanInput === 'contato@neolife.com';

    if (isAdminIdentifier && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({
        success: true,
        isAdmin: true,
        redirect: '/admin/dashboard',
        message: 'Acesso de Administrador reconhecido.',
      });

      // Set admin session cookie directly on root path
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      return response;
    }

    // ── Check Member credentials in database ────────────────────────
    await connectToDatabase();

    const member = await Member.findOne({ email: cleanInput });

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

    // Create JSON response for member
    const response = NextResponse.json({
      success: true,
      isAdmin: false,
      redirect: '/membro/dashboard',
      member: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        plan: member.plan,
        referralCode: member.referralCode,
      },
    });

    // Set member session cookie directly on response
    response.cookies.set(
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

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error?.message || 'Erro ao fazer login. Tente novamente.' },
      { status: 500 }
    );
  }
}
