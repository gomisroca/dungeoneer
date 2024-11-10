import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getDungeons() {
  const dungeons = [];
  // Dungeon IDs go from 1 to 99 (as of patch 7.05)
  for (let i = 1; i < 100; i++) {
    const dungeon = await fetch(`https://xivapi.com/instanceContent/${i}?columns=Name,Banner,Description&language=en`);
    const dungeonData = await dungeon.json();
    dungeons.push(dungeonData);
  }
  return dungeons;
}

async function createDungeon(dungeon) {
  try {
    // First check if the raid already exists
    const existingDungeon = await db.dungeon.findFirst({
      where: {
        name: dungeon.Name
      }
    });

    if (existingDungeon) {
      console.log(`Dungeon "${dungeon.Name}" already exists, skipping...`);
      return null;
    }

    let uploadedImageUrl = null;
    if (dungeon.Banner) {
      const imageUrl = 'https://xivapi.com' + dungeon.Banner;
      const fileName = imageUrl.split('/').pop().split('.png')[0];
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'dungeons', fileName);
    }

    // Get the highest existing ID
    const highest = await db.dungeon.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    const nextId = highest ? highest.id + 1 : 1;

    return await db.dungeon.create({
      data: {
        id: nextId,
        name: dungeon.Name,
        description: dungeon.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating dungeon ${dungeon.name}:`, error);
    return null;
  }
}

export default async function transformDungeons() {
  const dungeons = await getDungeons();
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < dungeons.length; i++) {
    const dungeon = dungeons[i];
    if(dungeon.Name && dungeon.Description && dungeon.Banner){
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