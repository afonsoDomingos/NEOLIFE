import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, Db } from 'mongodb';
import { isAdmin } from '@/lib/utils/auth';

const productLinks = [
  {
    productId: 'pack-pequeno-almoco',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/product/41062',
    available: true,
  },
  {
    productId: 'pack-perda-peso',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/weightmanagement',
    available: true,
  },
  {
    productId: 'programa-detox',
    productType: 'pack',
    purchaseUrl: '', // Não foi fornecido - ficará sem link
    available: false,
  },
  {
    productId: 'omega-3-salmon',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/hearthealth',
    available: true,
  },
  {
    productId: 'pensa-rapido',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/sharpermind',
    available: true,
  },
  {
    productId: 'feito-para-o-homem',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/menshealth',
    available: true,
  },
  {
    productId: 'feito-para-mulheres',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/womenshealth',
    available: true,
  },
  {
    productId: 'nutricao-pre-natal',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/product/2671',
    available: true,
  },
  {
    productId: 'aumente-sua-energia',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/energyfitness',
    available: true,
  },
  {
    productId: 'melhore-flexibilidade',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/bonejoint',
    available: true,
  },
  {
    productId: 'apoio-digestao',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/digestivehealth',
    available: true,
  },
  {
    productId: 'imunidade-phytodefence',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/immunedefense',
    available: true,
  },
  {
    productId: 'nutricao-infantil',
    productType: 'pack',
    purchaseUrl: 'https://shopneolife.com/ofeliajosemachado/shop/childrenshealth',
    available: true,
  },
];

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
    if (!isAdmin()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const database = await getDatabase();
    const collection = database.collection('productlinks');

    const results = [];

    for (const link of productLinks) {
      const result = await collection.updateOne(
        { productId: link.productId },
        { $set: link },
        { upsert: true }
      );

      const urlDisplay = link.purchaseUrl || 'sem link';
      if (result.upsertedCount > 0) {
        results.push({
          productId: link.productId,
          status: 'created',
          url: urlDisplay,
        });
      } else if (result.modifiedCount > 0) {
        results.push({
          productId: link.productId,
          status: 'updated',
          url: urlDisplay,
        });
      } else {
        results.push({
          productId: link.productId,
          status: 'exists',
          url: urlDisplay,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product links processed successfully',
      results,
    });
  } catch (error) {
    console.error('Error setting up product links:', error);
    return NextResponse.json(
      { error: 'Failed to setup product links', details: String(error) },
      { status: 500 }
    );
  }
}
