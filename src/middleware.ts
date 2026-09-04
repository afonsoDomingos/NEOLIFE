import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname === '/admin/login';
  const isDashboardPath = request.nextUrl.pathname === '/admin' || request.nextUrl.pathname === '/admin/';
  const session = request.cookies.get('admin_session');
  
  // Bypass authentication in development
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Redirect /admin to /admin/dashboard
  if (isDashboardPath) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  if (isAdminPath && !isLoginPath) {
    if (!isDevelopment) {
      if (!session || session.value !== 'authenticated') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  if (isLoginPath && session?.value === 'authenticated' && !isDevelopment) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};