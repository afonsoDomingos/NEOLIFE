import { MongoClient, Db } from 'mongodb';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

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

async function addProductLinks() {
  const client = new MongoClient(MONGODB_URI!);
  
  try {
    await client.connect();
    const db = client.db('neolife');
    const collection = db.collection('productlinks');

    console.log('Conectado ao MongoDB');
    console.log(`Adicionando ${productLinks.length} links de produtos...`);

    for (const link of productLinks) {
      const result = await collection.updateOne(
        { productId: link.productId },
        { $set: link },
        { upsert: true }
      );

      const urlDisplay = link.purchaseUrl || 'sem link';
      if (result.upsertedCount > 0) {
        console.log(`✓ Criado: ${link.productId} -> ${urlDisplay}`);
      } else if (result.modifiedCount > 0) {
        console.log(`✓ Atualizado: ${link.productId} -> ${urlDisplay}`);
      } else {
        console.log(`= Já existe: ${link.productId}`);
      }
    }

    console.log('\n✅ Todos os links foram processados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar links:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

addProductLinks();
