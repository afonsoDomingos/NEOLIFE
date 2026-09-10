import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';

function isAdmin(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  return session?.value === 'authenticated' || process.env.NODE_ENV === 'development';
}

// GET - Get single member
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const member = await Member.findById(id).select('-passwordHash');
    if (!member) {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    console.error('Get member error:', error);
    return NextResponse.json({ error: 'Erro ao obter membro.' }, { status: 500 });
  }
}

// PUT - Update member (status, plan, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const body = await request.json();

    // Allowed fields admin can update
    const allowed = ['name', 'phone', 'country', 'status', 'plan', 'invitedBy'];
    const updates: Record<string, string> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) updates[key] = body[key];
    }

    const member = await Member.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    ).select('-passwordHash');

    if (!member) {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar membro.' }, { status: 500 });
  }
}

// DELETE - Remove member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const { id } = await params;
    const member = await Member.findByIdAndDelete(id);
    if (!member) {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete member error:', error);
    return NextResponse.json({ error: 'Erro ao remover membro.' }, { status: 500 });
  }
}
