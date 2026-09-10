import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login';
  const isAdminDashboard = pathname === '/admin' || pathname === '/admin/';

  const isMemberPath = pathname.startsWith('/membro');
  const isMemberLogin = pathname.startsWith('/membro/login');
  const isMemberRegister = pathname.startsWith('/membro/registar');

  const adminSession = request.cookies.get('admin_session');
  const memberSession = request.cookies.get('member_session');

  const isDevelopment = process.env.NODE_ENV === 'development';

  // ── Admin routes ──────────────────────────────────────────────
  if (isAdminDashboard) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isAdminPath && !isAdminLogin) {
    if (!isDevelopment) {
      if (!adminSession || adminSession.value !== 'authenticated') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  if (isAdminLogin && adminSession?.value === 'authenticated' && !isDevelopment) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
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
      return NextResponse.redirect(new URL('/membro/login', request.url));
    }
  }

  // Redirect logged-in members away from login/register pages
  if ((isMemberLogin || isMemberRegister) && memberSession?.value) {
    try {
      JSON.parse(memberSession.value);
      return NextResponse.redirect(new URL('/membro/dashboard', request.url));
    } catch {
      // invalid session - allow through
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/membro/:path*'],
};