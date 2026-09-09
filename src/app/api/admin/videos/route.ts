import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllVideos, createVideo, updateVideo } from '@/lib/db/videos-mongodb';

async function checkAuth(isDev: boolean) {
  if (isDev) return true;
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session && session.value === 'authenticated';
}

export async function GET(request: NextRequest) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const authorized = await checkAuth(isDevelopment);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const videos = await getAllVideos();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Error in GET /api/admin/videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const authorized = await checkAuth(isDevelopment);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, videoUrl, thumbnailUrl, category, featured, active, order } = body;

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'Título e URL do vídeo são obrigatórios' },
        { status: 400 }
      );
    }

    const video = await createVideo({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      featured,
      active,
      order: order !== undefined ? Number(order) : 0,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/videos:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const authorized = await checkAuth(isDevelopment);
    if (!authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const id = body._id || body.id;

    if (id) {
      const video = await updateVideo(id, body);
      return NextResponse.json(video);
    } else {
      const video = await createVideo(body);
      return NextResponse.json(video);
    }
  } catch (error) {
    console.error('Error in PUT /api/admin/videos:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  return PUT(request);
}
