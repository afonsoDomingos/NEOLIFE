import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getLeadStats } from '@/lib/db/leads-mongodb';
import { getActiveThemes } from '@/lib/db/themes-mongodb';
import { getVisitStats } from '@/lib/db/visits-mongodb';
import { getAvailableCountries } from '@/data/countries';

export async function GET(request: NextRequest) {
  try {
    // Bypass authentication in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      const cookieStore = await cookies();
      const session = cookieStore.get('admin_session');

      if (!session || session.value !== 'authenticated') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const [stats, themes, visitStats] = await Promise.all([
      getLeadStats().catch(() => ({
        total: 0,
        today: 0,
        byCountry: {},
        byTheme: {},
        byCampaign: {},
        byStatus: { novo: 0, contactado: 0, acompanhamento: 0, interessado: 0, convertido: 0, nao_interessado: 0 },
        dailyTrend: []
      })),
      getActiveThemes().catch(() => []),
      getVisitStats().catch(() => ({
        totalViews: 0,
        totalVisitors: 0,
        todayViews: 0,
        todayVisitors: 0,
        topPages: [],
        dailyTrend: []
      }))
    ]);

    const activeCountriesCount = getAvailableCountries().length;
    const activeThemesCount = themes.length > 0 ? themes.length : 6;

    return NextResponse.json({
      ...stats,
      activeCountries: activeCountriesCount,
      activeThemes: activeThemesCount,
      visits: visitStats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error fetching stats' },
      { status: 500 }
    );
  }
}