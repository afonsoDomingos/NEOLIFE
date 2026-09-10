import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function isAdmin(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  return session?.value === 'authenticated' || process.env.NODE_ENV === 'development';
}

function generateReferralCode(name: string): string {
  const base = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${base}${suffix}`;
}

// GET - List all members
export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const filter: Record<string, string> = {};
    if (status) filter.status = status;

    const total = await Member.countDocuments(filter);
    const members = await Member.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ members, total, page, limit });
  } catch (error) {
    console.error('List members error:', error);
    return NextResponse.json({ error: 'Erro ao listar membros.' }, { status: 500 });
  }
}

// POST - Admin creates a member manually
export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const { name, email, password, phone, country, plan, status } = await request.json();

    if (!name || !email || !password || !phone || !country) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 });
    }

    const existing = await Member.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'Email já registado.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let referralCode = generateReferralCode(name);
    let attempts = 0;
    while (await Member.findOne({ referralCode }) && attempts < 10) {
      referralCode = generateReferralCode(name);
      attempts++;
    }

    const member = await Member.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      country,
      passwordHash,
      status: status || 'active',
      plan: plan || '',
      referralCode,
      invitedBy: 'admin',
    });

    return NextResponse.json({
      success: true,
      member: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        status: member.status,
        referralCode: member.referralCode,
      },
    });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json({ error: 'Erro ao criar membro.' }, { status: 500 });
  }
}
