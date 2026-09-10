import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateTheme, deleteTheme } from '@/lib/db/themes-mongodb';

async function handleUpdate(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
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

    const resolvedParams = await context.params;
    const id = decodeURIComponent(resolvedParams?.id || '');
    const updates = await request.json();
    const theme = await updateTheme(id, updates);

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(theme);
  } catch (error: any) {
    console.error('Error updating theme:', error);
    return NextResponse.json(
      { error: error?.message || 'Error updating theme' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return handleUpdate(request, context);
}

export async function DELETE(
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

    const resolvedParams = await context.params;
    const id = decodeURIComponent(resolvedParams?.id || '');
    await deleteTheme(id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting theme:', error);
    return NextResponse.json(
      { error: error?.message || 'Error deleting theme' },
      { status: 500 }
    );
  }
}