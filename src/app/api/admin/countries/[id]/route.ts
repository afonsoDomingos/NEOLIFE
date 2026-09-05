import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
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

    const { id } = await context.params;
    const body = await request.json();
    
    // For now, we'll just return success since we're using static data
    // In production, this would update the countries file/database
    return NextResponse.json(
      { success: true, message: 'Country updated (Note: Update countries data file directly for now)' }
    );
  } catch (error) {
    console.error('Error updating country:', error);
    return NextResponse.json(
      { error: 'Error updating country' },
      { status: 500 }
    );
  }
}