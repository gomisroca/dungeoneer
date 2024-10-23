import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getCards() {
  const res = await fetch('https://triad.raelys.com/api/cards');
  const data = await res.json();
  return data.results;
}

async function createCard(card) {
  try {
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
        create: {
          npcs: card.sources.npcs.map(n => n.name),
          packs: card.sources.packs.map(p => p.name),
          drops: card.sources.drops,
        }
      },
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
    console.error(`Error creating card ${card.name}:`, error);
    return null;
  }
}

export default async function transformCards() {
  const cards = await getCards();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const result = await createCard(card);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${cards.length} cards. Success: ${successCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all cards. Total Success: ${successCount}, Total Failed: ${failCount}`);
}
