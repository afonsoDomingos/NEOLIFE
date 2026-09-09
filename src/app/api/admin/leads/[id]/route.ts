import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateLead, deleteLead } from '@/lib/db/leads-mongodb';

async function checkAuth(isDev: boolean) {
  if (isDev) return true;
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === 'authenticated';
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!await checkAuth(isDevelopment)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const updates = await request.json();
    const lead = await updateLead(id, updates);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Error updating lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (!await checkAuth(isDevelopment)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = await deleteLead(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json({ error: 'Error deleting lead' }, { status: 500 });
  }
}