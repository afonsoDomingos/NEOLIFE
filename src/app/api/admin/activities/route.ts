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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const hours = parseInt(searchParams.get('hours') || '24');

    const database = await getDatabase();
    const now = new Date();
    const timeAgo = new Date(now.getTime() - hours * 60 * 60 * 1000);

    const activities: any[] = [];

    // Get recent leads
    try {
      const leadsCollection = database.collection('leads');
      const recentLeads = await leadsCollection
        .find({ createdAt: { $gte: timeAgo } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      recentLeads.forEach((lead: any) => {
        activities.push({
          type: 'lead',
          title: 'Novo Lead Registrado',
          description: `${lead.name} de ${lead.country}`,
          timestamp: lead.createdAt,
          details: {
            id: lead._id?.toString(),
            theme: lead.theme,
            source: lead.source,
          },
        });
      });
    } catch (error) {
      console.error('Error fetching leads:', error);
    }

    // Get recent product images added
    try {
      const productImagesCollection = database.collection('productImages');
      const recentImages = await productImagesCollection
        .find({ createdAt: { $gte: timeAgo } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      recentImages.forEach((img: any) => {
        activities.push({
          type: 'product_image',
          title: 'Nova Imagem de Produto',
          description: `Imagem adicionada para ${img.productType}`,
          timestamp: img.createdAt,
          details: {
            productId: img.productId,
            productType: img.productType,
          },
        });
      });
    } catch (error) {
      console.error('Error fetching product images:', error);
    }

    // Get recent health products created/updated
    try {
      const healthProductsCollection = database.collection('healthProducts');
      const recentProducts = await healthProductsCollection
        .find({ createdAt: { $gte: timeAgo } })
        .sort({ createdAt: -1 })
        .limit(limit)
        .toArray();

      recentProducts.forEach((product: any) => {
        activities.push({
          type: 'health_product',
          title: 'Novo Produto de Saúde',
          description: product.titlePt,
          timestamp: product.createdAt,
          details: {
            id: product.id,
            category: product.category,
          },
        });
      });
    } catch (error) {
      console.error('Error fetching health products:', error);
    }

    // Get recent updated products (excluding newly created)
    try {
      const healthProductsCollection = database.collection('healthProducts');
      const updatedProducts = await healthProductsCollection
        .find({ 
          updatedAt: { $gte: timeAgo },
          createdAt: { $lt: timeAgo }
        })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .toArray();

      updatedProducts.forEach((product: any) => {
        activities.push({
          type: 'health_product_updated',
          title: 'Produto Atualizado',
          description: product.titlePt,
          timestamp: product.updatedAt,
          details: {
            id: product.id,
            category: product.category,
          },
        });
      });
    } catch (error) {
      console.error('Error fetching updated products:', error);
    }

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Limit total results
    const limitedActivities = activities.slice(0, limit);

    return NextResponse.json({
      activities: limitedActivities,
      total: activities.length,
      timeRange: hours,
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}