import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true, message: 'Sessão terminada com sucesso' });

    // Explicitly delete admin session cookie on root path
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Erro ao terminar sessão' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Support direct GET navigation for logout as well
  const redirectUrl = new URL('/admin/login', request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}