import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';

// Database connection
let db: Db;

async function getDatabase(): Promise<Db> {
  if (!db) {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    db = client.db('neolife');
  }
  return db;
}

// GET - Fetch product click statistics
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, all
    const productId = searchParams.get('productId');

    const database = await getDatabase();
    const collection = database.collection('product_clicks');

    // Calculate date range
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Build query
    const query: any = {
      timestamp: { $gte: startDate },
    };

    if (productId) {
      query.productId = productId;
    }

    // Fetch all clicks in the period
    const clicks = await collection.find(query).sort({ timestamp: -1 }).toArray();

    // Calculate statistics
    const totalClicks = clicks.length;
    
    // Clicks by product
    const clicksByProduct: Record<string, number> = {};
    clicks.forEach((click: any) => {
      const key = click.productId;
      clicksByProduct[key] = (clicksByProduct[key] || 0) + 1;
    });

    // Clicks by product type
    const clicksByType: Record<string, number> = {};
    clicks.forEach((click: any) => {
      const key = click.productType;
      clicksByType[key] = (clicksByType[key] || 0) + 1;
    });

    // Clicks by country
    const clicksByCountry: Record<string, number> = {};
    clicks.forEach((click: any) => {
      if (click.country) {
        const key = click.country;
        clicksByCountry[key] = (clicksByCountry[key] || 0) + 1;
      }
    });

    // Clicks by source
    const clicksBySource: Record<string, number> = {};
    clicks.forEach((click: any) => {
      if (click.source) {
        const key = click.source;
        clicksBySource[key] = (clicksBySource[key] || 0) + 1;
      }
    });

    // Daily trend
    const dailyTrend: Record<string, number> = {};
    clicks.forEach((click: any) => {
      const date = new Date(click.timestamp).toISOString().split('T')[0];
      dailyTrend[date] = (dailyTrend[date] || 0) + 1;
    });

    // Sort daily trend by date
    const sortedDailyTrend = Object.entries(dailyTrend)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    return NextResponse.json({
      totalClicks,
      clicksByProduct,
      clicksByType,
      clicksByCountry,
      clicksBySource,
      dailyTrend: sortedDailyTrend,
      recentClicks: clicks.slice(0, 50), // Last 50 clicks
    });
  } catch (error) {
    console.error('Error fetching product click statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}