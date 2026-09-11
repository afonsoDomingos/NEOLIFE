import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Announcement from '@/lib/db/models/Announcement';

function requireAdmin(req: NextRequest) {
  const session = req.cookies.get('admin_session');
  if (!session?.value) return false;
  return true;
}

// GET — list all announcements (admin)
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(announcements);
}

// POST — create announcement
export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { title, message, type, expiresAt } = body;

  if (!title?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Título e mensagem são obrigatórios.' }, { status: 400 });
  }

  const announcement = await Announcement.create({
    title: title.trim(),
    message: message.trim(),
    type: type || 'info',
    active: true,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  });

  return NextResponse.json(announcement, { status: 201 });
}

// PATCH — toggle active or update
export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id, active } = body;
  if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 });

  const updated = await Announcement.findByIdAndUpdate(id, { active }, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE — remove announcement
export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 });

  await Announcement.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

