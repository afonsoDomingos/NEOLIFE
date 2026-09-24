import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongodb';
import { healthSolutionPacks } from '@/data/health-solutions';

export async function POST(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection('healthProducts');

    let migrated = 0;
    let skipped = 0;

    for (const pack of healthSolutionPacks) {
      const existing = await collection.findOne({ id: pack.id });
      
      if (existing) {
        skipped++;
        continue;
      }

      await collection.insertOne({
        ...pack,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      migrated++;
    }

    return NextResponse.json({
      success: true,
      migrated,
      skipped,
      total: healthSolutionPacks.length,
      message: `Migrated ${migrated} products, skipped ${skipped} existing products`,
    });
  } catch (error) {
    console.error('Error migrating health products:', error);
    return NextResponse.json({ error: 'Failed to migrate health products' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const collection = db.collection('healthProducts');
    
    const count = await collection.countDocuments();
    const staticCount = healthSolutionPacks.length;

    return NextResponse.json({
      dbCount: count,
      staticCount,
      needsMigration: count < staticCount,
    });
  } catch (error) {
    console.error('Error checking migration status:', error);
    return NextResponse.json({ error: 'Failed to check migration status' }, { status: 500 });
  }
}