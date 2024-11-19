import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getDungeons() {
  const dungeonsFetch = await fetch(`https://beta.xivapi.com/api/1/search?sheets=ContentFinderCondition&fields=Name,Image&transient=Description&query=ContentType.Name~"Dungeon Finder"&limit=500`);
  const dungeons = await dungeonsFetch.json();
  return dungeons.results;
}

async function createDungeon(dungeon) {
  try {
    // First check if the raid already exists
    const existingDungeon = await db.variantDungeon.findFirst({
      where: {
        name: dungeon.fields.Name
      }
    });

    if (existingDungeon) {
      console.log(`V&C dungeon "${dungeon.fields.Name}" already exists, skipping...`);
      return null;
    }

    let uploadedImageUrl = null;
    if (dungeon.fields.Image) {
      const imageUrl = `https://beta.xivapi.com/api/1/asset?path=${dungeon.fields.Image.path}&format=png`;
      const fileName = `${dungeon.fields.Image.id}.png`;
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'variants', fileName);
    }

    // Get the highest existing ID
    const highest = await db.variantDungeon.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    const nextId = highest ? highest.id + 1 : 1;

    return await db.variantDungeon.create({
      data: {
        id: nextId,
        name: dungeon.fields.Name,
        description: dungeon.transient.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating dungeon ${dungeon.fields.Name}:`, error);
    return null;
  }
}

export default async function transformVariants() {
  const dungeons = await getDungeons();
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < dungeons.length; i++) {
    const dungeon = dungeons[i];
    if(dungeon.fields.Name && dungeon.transient.Description && dungeon.fields.Image.path){
      const result = await createDungeon(dungeon);
      if (result) {
        successCount++;
      } else {
        // If result is null, it might be because the raid already exists
        skipCount++;
      }
    } else {
      skipCount++;
    }
   
    console.log(`Processed ${i + 1} out of ${dungeons.length} dungeons. Success: ${successCount}, Failed: ${failCount}, Skipped: ${skipCount}`);
  }

  console.log(`Finished processing all dungeons. Total Success: ${successCount}, Total Failed: ${failCount}, Total Skipped: ${skipCount}`);
}