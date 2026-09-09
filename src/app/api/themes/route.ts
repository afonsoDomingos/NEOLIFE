import { NextRequest, NextResponse } from 'next/server';
import { getActiveThemes, getThemeBySlug } from '@/lib/db/themes-mongodb';
import { getActiveThemes as getStaticActiveThemes, getThemeBySlug as getStaticThemeBySlug } from '@/data/themes';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  try {
    if (slug) {
      const theme = await getThemeBySlug(slug);
      if (theme) {
        return NextResponse.json(theme);
      }
      // Fallback to static theme if not in DB
      const fallback = getStaticThemeBySlug(slug);
      if (fallback) {
        return NextResponse.json(fallback);
      }
      return NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }

    const themes = await getActiveThemes();
    return NextResponse.json(themes);
  } catch (error) {
    console.error('Error in /api/themes, using static fallback:', error);
    if (slug) {
      const fallback = getStaticThemeBySlug(slug);
      return fallback
        ? NextResponse.json(fallback)
        : NextResponse.json({ error: 'Theme not found' }, { status: 404 });
    }
    return NextResponse.json(getStaticActiveThemes());
  }
}
