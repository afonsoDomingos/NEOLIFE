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
    purchaseUrl: '',
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

async function seedLinksViaAPI() {
  const API_URL = 'http://localhost:3001/api/admin/setup-product-links';

  console.log('Sending product links to API...');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productLinks),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Success! Product links added:');
      data.results.forEach((result) => {
        console.log(`  ${result.status}: ${result.productId} -> ${result.url}`);
      });
    } else {
      const error = await response.text();
      console.error('❌ Error from API:', response.status, error);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure the dev server is running on http://localhost:3001');
  }
}

seedLinksViaAPI();
