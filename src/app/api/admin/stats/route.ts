import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getLeadStats } from '@/lib/db/leads';

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

    const stats = getLeadStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error fetching stats' },
      { status: 500 }
    );
  }
}