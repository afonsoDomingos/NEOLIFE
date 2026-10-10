import { NextRequest, NextResponse } from 'next/server';
import { recordVisit } from '@/lib/db/visits-mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { path, visitorId, referrer, country } = body;

    if (!path || typeof path !== 'string' || !visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ error: 'path and visitorId are required' }, { status: 400 });
    }

    // Never track admin panel pages
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ignored: true });
    }

    // Determine device type from User-Agent
    const userAgent = request.headers.get('user-agent') || '';
    let device: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      device = 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent)) {
      device = 'mobile';
    }

    await recordVisit({
      path,
      visitorId,
      referrer,
      device,
      country,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
