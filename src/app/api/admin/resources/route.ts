import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Resource from '@/lib/db/models/Resource';

function requireAdmin(req: NextRequest) {
  return !!req.cookies.get('admin_session')?.value;
}

// GET — all resources (admin, including unpublished)
export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const resources = await Resource.find().sort({ order: 1, createdAt: -1 }).lean();
  return NextResponse.json(resources);
}

// POST — create resource
export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { title, description, type, url, order } = body;

  if (!title?.trim() || !url?.trim()) {
    return NextResponse.json({ error: 'Título e URL são obrigatórios.' }, { status: 400 });
  }

  const resource = await Resource.create({
    title: title.trim(),
    description: description?.trim() || '',
    type: type || 'link',
    url: url.trim(),
    published: true,
    order: order ?? 0,
  });

  return NextResponse.json(resource, { status: 201 });
}

// PATCH — toggle published or reorder
export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const { id, published, order } = body;
  if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 });

  const update: Record<string, unknown> = {};
  if (published !== undefined) update.published = published;
  if (order !== undefined) update.order = order;

  const updated = await Resource.findByIdAndUpdate(id, update, { new: true }).lean();
  if (!updated) return NextResponse.json({ error: 'Não encontrado.' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE — remove resource
export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID obrigatório.' }, { status: 400 });

  await Resource.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

