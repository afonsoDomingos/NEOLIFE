import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updatePillarCard } from '@/lib/db/pillar-cards-mongodb';

async function checkAuth() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) return true;
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (!['saude', 'business', 'experiencias'].includes(id)) {
      return NextResponse.json({ error: 'Invalid pillar ID' }, { status: 400 });
    }

    const updated = await updatePillarCard(id, {
      image: body.image,
      altText: body.altText,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating pillar card:', error);
    return NextResponse.json({ error: 'Error updating pillar card' }, { status: 500 });
  }
}
