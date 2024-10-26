import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getHairstyles() {
  const res = await fetch('https://ffxivcollect.com/api/hairstyles');
  const data = await res.json();
  return data.results;
}

async function createHairstyle(hairstyle) {
  try {
    let uploadedImageUrl = null;
    if (hairstyle.icon) {
      const fileName = `${hairstyle.id}.${hairstyle.icon.split('.').pop()}`;
      uploadedImageUrl = await uploadImageToSupabase(hairstyle.icon, 'hairstyles', fileName);
    }

    return await db.hairstyle.create({
      data: {
        name: hairstyle.name,
        description: hairstyle.description,
        patch: hairstyle.patch,
        tradeable: hairstyle.tradeable,
        image: uploadedImageUrl ?? hairstyle.icon,
        owned: hairstyle.owned,
        sources: {
          create: hairstyle.sources.map((source) => ({
            type: source.type,
            text: source.text,
          })),
        },
      }
    });
  } catch (error) {
    console.error(`Error creating hairstyle ${hairstyle.name}:`, error);
    return null;
  }
}

export default async function transformHairstyles() {
  const hairstyles = await getHairstyles();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < hairstyles.length; i++) {
    const hairstyle = hairstyles[i];
    const result = await createHairstyle(hairstyle);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${hairstyles.length} hairstyles. Success: ${successCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all hairstyles. Total Success: ${successCount}, Total Failed: ${failCount}`);
}