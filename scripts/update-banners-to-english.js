const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const bannerTranslations = {
  'Construa o Seu Próprio Negócio com a NeoLife em África': 'Build Your Own Business with NeoLife in Africa',
  'Descubra como transformar a sua saúde, bem-estar e criar novas oportunidades financeiras sustentáveis ao lado de uma mentoria comprovada.': 'Discover how to transform your health, wellness, and create sustainable financial opportunities alongside proven mentorship.',
  'Conhecer o Business': 'Explore Business',
  'Nutrição Superior & Vitalidade Celular para Toda a Família': 'Superior Nutrition & Cellular Vitality for Your Whole Family',
  'Baseada na Natureza e Apoiada pela Ciência. Descubra suplementos de qualidade máxima formulados para otimizar o seu bem-estar diário.': 'Based in Nature and Backed by Science. Discover premium quality supplements formulated to optimize your daily well-being.',
  'Explorar Soluções de Saúde': 'Explore Health Solutions',
  'Viva Experiências Exclusivas & Reconhecimento Global': 'Live Exclusive Experiences & Global Recognition',
  'Expanda os seus horizontes, celebre grandes conquistas e faça parte de viagens internacionais inesquecíveis.': 'Expand your horizons, celebrate great achievements, and be part of unforgettable international trips.',
  'Descobrir Experiências': 'Discover Experiences',
  'Liderança e Desenvolvimento: Juntos por um Futuro Melhor': 'Leadership and Development: Together for a Better Future',
  'Mais de 60 anos de história e inovação global. Conte com o apoio e a mentoria direta de José Sarmento Machado e Ofélia Alfredo Machado.': 'Over 60 years of history and global innovation. Count on the support and direct mentorship of José Sarmento Machado and Ofélia Alfredo Machado.',
  'Falar com os Mentores': 'Talk to Mentors',
};

async function updateBannersToEnglish() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db('neolife');
    const collection = db.collection('banners');

    console.log('Conectado ao MongoDB');
    console.log('Atualizando banners para inglês...');

    const banners = await collection.find({}).toArray();
    console.log(`Encontrados ${banners.length} banners`);

    let updatedCount = 0;

    for (const banner of banners) {
      let needsUpdate = false;
      const updateData: any = {};

      // Check and translate title
      if (bannerTranslations[banner.title]) {
        updateData.title = bannerTranslations[banner.title];
        needsUpdate = true;
      }

      // Check and translate description
      if (bannerTranslations[banner.description]) {
        updateData.description = bannerTranslations[banner.description];
        needsUpdate = true;
      }

      // Check and translate buttonText
      if (bannerTranslations[banner.buttonText]) {
        updateData.buttonText = bannerTranslations[banner.buttonText];
        needsUpdate = true;
      }

      if (needsUpdate) {
        await collection.updateOne(
          { _id: banner._id },
          { $set: updateData }
        );
        console.log(`✓ Atualizado: ${banner.title.substring(0, 50)}...`);
        updatedCount++;
      } else {
        console.log(`= Já em inglês: ${banner.title.substring(0, 50)}...`);
      }
    }

    console.log(`\n✅ ${updatedCount} banners atualizados com sucesso!`);
  } catch (error) {
    console.error('Erro ao atualizar banners:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

updateBannersToEnglish();
