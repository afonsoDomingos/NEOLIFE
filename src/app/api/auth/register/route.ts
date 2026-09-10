import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db/mongodb';
import Member from '@/lib/db/models/Member';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

function generateReferralCode(name: string): string {
  const base = name.replace(/\s+/g, '').substring(0, 4).toUpperCase();
  const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${base}${suffix}`;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, country, referredBy } =
      await request.json();

    // Validate required fields
    if (!name || !email || !password || !phone || !country) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email already exists
    const existing = await Member.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { error: 'Este email já está registado. Faça login.' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Generate unique referral code
    let referralCode = generateReferralCode(name);
    let attempts = 0;
    while (await Member.findOne({ referralCode }) && attempts < 10) {
      referralCode = generateReferralCode(name);
      attempts++;
    }

    // Create member
    const member = await Member.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone,
      country,
      passwordHash,
      status: 'active',
      plan: '',
      referralCode,
      referredBy: referredBy || undefined,
    });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set(
      'member_session',
      JSON.stringify({ id: member._id.toString(), email: member.email }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      }
    );

    return NextResponse.json({
      success: true,
      member: {
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        referralCode: member.referralCode,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    );
  }
}
