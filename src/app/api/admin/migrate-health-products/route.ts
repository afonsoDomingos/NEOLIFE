import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';
import { healthSolutionPacks } from '@/data/health-solutions';

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

export async function POST(request: NextRequest) {
  try {
    const database = await getDatabase();
    const collection = database.collection('healthProducts');

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
    const database = await getDatabase();
    const collection = database.collection('healthProducts');
    
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