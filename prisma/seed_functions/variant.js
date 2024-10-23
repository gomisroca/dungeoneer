import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getDungeons() {
  const dungeons = [];
  // Variant Dungeon IDs go from 37001 to 37006
  for (let i = 37001; i < 37007; i++) {
    const dungeon = await fetch(`https://cafemaker.wakingsands.com/instanceContent/${i}?columns=Name,Banner,Description&language=en`);
    const dungeonData = await dungeon.json();
    dungeons.push(dungeonData);
  }
  return dungeons;
}

async function createDungeon(dungeon) {
  try {
    let uploadedImageUrl = null;
    if (dungeon.Banner) {
      const imageUrl = 'https://cafemaker.wakingsands.com' + dungeon.Banner;
      const fileName = imageUrl.split('/').pop().split('.png')[0];
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'variants', fileName);
    }


    return await db.variantDungeon.create({
      data: {
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

export default async function transformVariants() {
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
        failCount++;
      }
    } else{
      skipCount++
    }
   
    console.log(`Processed ${i + 1} out of ${dungeons.length} dungeons. Success: ${successCount}, Failed: ${failCount}, Skipped: ${skipCount}`);
  }

  console.log(`Finished processing all dungeons. Total Success: ${successCount}, Total Failed: ${failCount}`);
}