import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllThemes, createTheme } from '@/lib/db/themes-mongodb';

export async function GET(request: NextRequest) {
  try {
    // Bypass authentication in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const cookieStore = await cookies();
      const session = cookieStore.get('admin_session');

      if (!session || session.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const themes = await getAllThemes();
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Error fetching themes:', error);
    return NextResponse.json(
      { error: 'Error fetching themes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Bypass authentication in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const cookieStore = await cookies();
      const session = cookieStore.get('admin_session');

      if (!session || session.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const theme = await createTheme(body);

    return NextResponse.json(theme, { status: 201 });
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Error creating theme' },
      { status: 500 }
    );
  }
}