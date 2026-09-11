import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  const isAdminRoot = pathname === '/admin' || pathname === '/admin/';

  const isMemberPath = pathname.startsWith('/membro');
  const isMemberLogin = pathname.startsWith('/membro/login');
  const isMemberRegister = pathname.startsWith('/membro/registar');

  const adminSession = request.cookies.get('admin_session');
  const memberSession = request.cookies.get('member_session');

  const isDevelopment = process.env.NODE_ENV === 'development';
  const isAdminAuth = adminSession?.value === 'authenticated' || isDevelopment;

  // ── Admin routes ──────────────────────────────────────────────
  if (isAdminRoot) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = isAdminAuth ? '/admin/dashboard' : '/admin/login';
    return NextResponse.redirect(targetUrl);
  }

  if (isAdminPath && !isAdminLogin) {
    if (!isAdminAuth) {
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = '/admin/login';
      return NextResponse.redirect(targetUrl);
    }
  }

  if (isAdminLogin && isAdminAuth && !isDevelopment) {
    const targetUrl = request.nextUrl.clone();
    targetUrl.pathname = '/admin/dashboard';
    return NextResponse.redirect(targetUrl);
  }

  // ── Member routes ─────────────────────────────────────────────
  if (isMemberPath && !isMemberLogin && !isMemberRegister) {
    let valid = false;
    if (memberSession?.value) {
      try {
        JSON.parse(memberSession.value);
        valid = true;
      } catch {
        valid = false;
      }
    }
    if (!valid) {
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = '/membro/login';
      return NextResponse.redirect(targetUrl);
    }
  }

  // Redirect logged-in members away from login/register pages
  if ((isMemberLogin || isMemberRegister) && memberSession?.value) {
    try {
      JSON.parse(memberSession.value);
      const targetUrl = request.nextUrl.clone();
      targetUrl.pathname = '/membro/dashboard';
      return NextResponse.redirect(targetUrl);
    } catch {
      // invalid session - allow through
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/membro/:path*'],
};