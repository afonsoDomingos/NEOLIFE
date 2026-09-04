import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getActiveThemes } from '@/data/themes';

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

    const themes = getActiveThemes();
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
    
    // For now, we'll just return success since we're using static data
    // In production, this would update the themes file/database
    return NextResponse.json(
      { success: true, message: 'Theme created (Note: Update themes data file directly for now)' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating theme:', error);
    return NextResponse.json(
      { error: 'Error creating theme' },
      { status: 500 }
    );
  }
}