import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getCards() {
  const res = await fetch('https://ffxivcollect.com/api/triad/cards');
  const data = await res.json();
  return data.results;
}

async function createCard(card) {
  try {
    // Check if the mount already exists
    const existingCard = await db.card.findFirst({
      where: { name: card.name },
    });
    if (existingCard) {
      console.log(`Card ${card.name} already exists. Skipping.`);
      return null;
    }

    let uploadedImageUrl = null;
    if (card.image) {
      const fileName = `${card.id}.${card.image.split('.').pop()}`;
      uploadedImageUrl = await uploadImageToSupabase(card.image, 'cards', fileName);
    }
    const cardData = {
      name: card.name,
      description: card.description,
      patch: card.patch,
      stars: card.stars,
      number: card.number,
      image: uploadedImageUrl ?? card.image,
      owned: card.owned,  
      sources: {
        create: card.sources.map((source) => ({
          type: source.type,
          text: source.text,
        })),
      }
    };
    
    if (card.stats) {
      cardData.stats = {
        create: {
          top: card.stats.numeric.top,
          right: card.stats.numeric.right,
          bottom: card.stats.numeric.bottom,
          left: card.stats.numeric.left,
        },
      };
    }

    return await db.card.create({
      data: cardData,
    });
  } catch (error) {
    console.error(`Error processing card ${card.name}:`, error);
    return null;
  }
}

export default async function transformCards() {
  const cards = await getCards();
  let newCount = 0;
  let existingCount = 0;
  let failCount = 0;


  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const result = await createCard(card);
    if (result) {
      newCount++;
    } else if (result === null) {
      existingCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${cards.length} cards. New: ${newCount}, Existing: ${existingCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all cards. Total New: ${newCount}, Total Existing: ${existingCount}, Total Failed: ${failCount}`);
}
