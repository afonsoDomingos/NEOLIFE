import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateVideo, deleteVideo } from '@/lib/db/videos-mongodb';

async function checkAuth(isDev: boolean) {
  if (isDev) return true;
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session && session.value === 'authenticated';
}

async function handleUpdate(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const authorized = await checkAuth(isDevelopment);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();

    if (body.order !== undefined) {
      body.order = Number(body.order);
    }

    const video = await updateVideo(id, body);
    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Error updating video' },
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
    const isDevelopment = process.env.NODE_ENV === 'development';
    const authorized = await checkAuth(isDevelopment);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const result = await deleteVideo(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Error deleting video' },
      { status: 500 }
    );
  }
}
