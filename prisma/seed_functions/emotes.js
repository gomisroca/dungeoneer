import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getEmotes() {
  const res = await fetch('https://ffxivcollect.com/api/emotes');
  const data = await res.json();
  return data.results;
}

async function createEmote(emote) {
  try {
    let uploadedImageUrl = null;
    if (emote.icon) {
      const fileName = `${emote.id}.${emote.icon.split('.').pop()}`;
      uploadedImageUrl = await uploadImageToSupabase(emote.icon, 'emotes', fileName);
    }

    return await db.emote.create({
      data: {
        name: emote.name,
        patch: emote.patch,
        tradeable: emote.tradeable,
        image: uploadedImageUrl ?? emote.icon,
        owned: emote.owned,
        sources: {
          create: emote.sources.map((source) => ({
            type: source.type,
            text: source.text,
          })),
        },
      }
    });
  } catch (error) {
    console.error(`Error creating emote ${emote.name}:`, error);
    return null;
  }
}

export default async function transformEmotes() {
  const emotes = await getEmotes();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < emotes.length; i++) {
    const emote = emotes[i];
    const result = await createEmote(emote);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${emotes.length} emotes. Success: ${successCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all emotes. Total Success: ${successCount}, Total Failed: ${failCount}`);
}