import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const body = await request.json();
    
    // For now, we'll just return success since we're using static data
    // In production, this would update the themes file/database
    return NextResponse.json(
      { success: true, message: 'Theme updated (Note: Update themes data file directly for now)' }
    );
  } catch (error) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: 'Error updating theme' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    // For now, we'll just return success since we're using static data
    // In production, this would delete from the themes file/database
    return NextResponse.json(
      { success: true, message: 'Theme deleted (Note: Update themes data file directly for now)' }
    );
  } catch (error) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: 'Error deleting theme' },
      { status: 500 }
    );
  }
}