import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getHairstyles() {
  const res = await fetch('https://ffxivcollect.com/api/hairstyles');
  const data = await res.json();
  return data.results;
}

async function createHairstyle(hairstyle) {
  try {
      // Check if the hairstyle already exists
    const existingHairstyle = await db.hairstyle.findFirst({
      where: { name: hairstyle.name },
    });
    if (existingHairstyle) {
      console.log(`Hairstyle ${hairstyle.name} already exists. Skipping.`);
      return null;
    }

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
    console.error(`Error processing hairstyle ${hairstyle.name}:`, error);
    return null;
  }
}

export default async function transformHairstyles() {
  const hairstyles = await getHairstyles();
  let newCount = 0;
  let existingCount = 0;
  let failCount = 0;

  for (let i = 0; i < hairstyles.length; i++) {
    const hairstyle = hairstyles[i];
    const result = await createHairstyle(hairstyle);
    if (result) {
      newCount++;
    } else if (result === null) {
      existingCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${hairstyles.length} hairstyles. New: ${newCount}, Existing: ${existingCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all hairstyles. Total New: ${newCount}, Total Existing: ${existingCount}, Total Failed: ${failCount}`);
}