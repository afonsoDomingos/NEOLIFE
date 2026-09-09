import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllThemes, createTheme } from '@/lib/db/themes-mongodb';
import { themes as staticThemes } from '@/data/themes';

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
    // If DB returns empty, fall back to static themes so admin is never blank
    if (!themes || themes.length === 0) {
      return NextResponse.json(staticThemes);
    }
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Error fetching themes (falling back to static):', error);
    // Fallback to static data so admin page always shows something
    return NextResponse.json(staticThemes);
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