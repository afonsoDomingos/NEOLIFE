import connectDB from './mongodb';
import PillarCard, { IPillarCard } from './models/PillarCard';

const DEFAULT_IMAGES: Record<string, string> = {
  saude: '/images/sections/pilar-saude.jpg',
  business: '/images/sections/pilar-business.jpg',
  experiencias: '/images/sections/pilar-experiencias.jpg',
};

const DEFAULT_ALT: Record<string, string> = {
  saude: 'Família saudável e feliz',
  business: 'Empreendedor a trabalhar no computador',
  experiencias: 'Casal a viajar pelo mundo',
};

export async function getAllPillarCards(): Promise<IPillarCard[]> {
  await connectDB();

  // Ensure all 3 exist with defaults
  for (const id of ['saude', 'business', 'experiencias']) {
    const exists = await PillarCard.findOne({ pillarId: id });
    if (!exists) {
      await PillarCard.create({
        pillarId: id,
        image: DEFAULT_IMAGES[id],
        altText: DEFAULT_ALT[id],
      });
    }
  }

  return (await PillarCard.find().sort({ pillarId: 1 })) as IPillarCard[];
}

export async function getPillarCard(pillarId: string): Promise<IPillarCard | null> {
  await connectDB();
  return (await PillarCard.findOne({ pillarId })) as IPillarCard | null;
}

export async function updatePillarCard(
  pillarId: string,
  data: { image?: string; altText?: string }
): Promise<IPillarCard | null> {
  await connectDB();
  const card = await PillarCard.findOneAndUpdate(
    { pillarId },
    { $set: data },
    { new: true, upsert: true }
  );
  return card as IPillarCard | null;
}
