import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { loadLeads } from '@/lib/db/leads';

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

    const leads = loadLeads();
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Error fetching leads' },
      { status: 500 }
    );
  }
}