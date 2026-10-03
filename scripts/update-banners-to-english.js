const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const bannerTranslations = {
  'Construa o Seu Próprio Negócio com a NeoLife em África': {
    titleEn: 'Build Your Own Business with NeoLife in Africa',
    descriptionEn: 'Discover how to transform your health, wellness, and create sustainable financial opportunities alongside proven mentorship.',
    buttonTextEn: 'Explore Business',
  },
  'Descubra como transformar a sua saúde, bem-estar e criar novas oportunidades financeiras sustentáveis ao lado de uma mentoria comprovada.': {
    descriptionEn: 'Discover how to transform your health, wellness, and create sustainable financial opportunities alongside proven mentorship.',
  },
  'Conhecer o Business': {
    buttonTextEn: 'Explore Business',
  },
  'Nutrição Superior & Vitalidade Celular para Toda a Família': {
    titleEn: 'Superior Nutrition & Cellular Vitality for Your Whole Family',
    descriptionEn: 'Based in Nature and Backed by Science. Discover premium quality supplements formulated to optimize your daily well-being.',
    buttonTextEn: 'Explore Health Solutions',
  },
  'Baseada na Natureza e Apoiada pela Ciência. Descubra suplementos de qualidade máxima formulados para otimizar o seu bem-estar diário.': {
    descriptionEn: 'Based in Nature and Backed by Science. Discover premium quality supplements formulated to optimize your daily well-being.',
  },
  'Explorar Soluções de Saúde': {
    buttonTextEn: 'Explore Health Solutions',
  },
  'Viva Experiências Exclusivas & Reconhecimento Global': {
    titleEn: 'Live Exclusive Experiences & Global Recognition',
    descriptionEn: 'Expand your horizons, celebrate great achievements, and be part of unforgettable international trips.',
    buttonTextEn: 'Discover Experiences',
  },
  'Expanda os seus horizontes, celebre grandes conquistas e faça parte de viagens internacionais inesquecíveis.': {
    descriptionEn: 'Expand your horizons, celebrate great achievements, and be part of unforgettable international trips.',
  },
  'Descobrir Experiências': {
    buttonTextEn: 'Discover Experiences',
  },
  'Liderança e Desenvolvimento: Juntos por um Futuro Melhor': {
    titleEn: 'Leadership and Development: Together for a Better Future',
    descriptionEn: 'Over 60 years of history and global innovation. Count on the support and direct mentorship of José Sarmento Machado and Ofélia Alfredo Machado.',
    buttonTextEn: 'Talk to Mentors',
  },
  'Mais de 60 anos de história e inovação global. Conte com o apoio e a mentoria direta de José Sarmento Machado e Ofélia Alfredo Machado.': {
    descriptionEn: 'Over 60 years of history and global innovation. Count on the support and direct mentorship of José Sarmento Machado and Ofélia Alfredo Machado.',
  },
  'Falar com os Mentores': {
    buttonTextEn: 'Talk to Mentors',
  },
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

      // Add English translations while keeping Portuguese
      if (bannerTranslations[banner.title]) {
        if (!banner.titleEn) {
          updateData.titleEn = bannerTranslations[banner.title].titleEn;
          needsUpdate = true;
        }
        if (!banner.titlePt) {
          updateData.titlePt = banner.title;
          needsUpdate = true;
        }
      }

      if (bannerTranslations[banner.description]) {
        if (!banner.descriptionEn && bannerTranslations[banner.description].descriptionEn) {
          updateData.descriptionEn = bannerTranslations[banner.description].descriptionEn;
          needsUpdate = true;
        }
        if (!banner.descriptionPt) {
          updateData.descriptionPt = banner.description;
          needsUpdate = true;
        }
      }

      if (bannerTranslations[banner.buttonText]) {
        if (!banner.buttonTextEn && bannerTranslations[banner.buttonText].buttonTextEn) {
          updateData.buttonTextEn = bannerTranslations[banner.buttonText].buttonTextEn;
          needsUpdate = true;
        }
        if (!banner.buttonTextPt) {
          updateData.buttonTextPt = banner.buttonText;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await collection.updateOne(
          { _id: banner._id },
          { $set: updateData }
        );
        console.log(`✓ Atualizado: ${banner.title.substring(0, 50)}...`);
        updatedCount++;
      } else {
        console.log(`= Já tem traduções: ${banner.title.substring(0, 50)}...`);
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
