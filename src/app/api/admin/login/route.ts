import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// In production, this should use proper authentication with bcrypt, JWT, etc.
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Change this in production!

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Set a simple cookie for authentication
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}