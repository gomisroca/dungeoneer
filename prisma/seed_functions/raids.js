import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getRaids() {
  const raids = [];
  // Raid IDs go from 30001 to 30142 (as of patch 7.05)
  for (let i = 30135; i < 30143; i++) {
    const raid = await fetch(`https://xivapi.com/instanceContent/${i}?columns=Name,Banner,Description&language=en`);
    const raidData = await raid.json();
    
    raids.push(raidData);
  }
  return raids;
}

async function createRaid(raid) {
  try {
    // First check if the raid already exists
    const existingRaid = await db.raid.findFirst({
      where: {
        name: raid.Name
      }
    });

    if (existingRaid) {
      console.log(`Raid "${raid.Name}" already exists, skipping...`);
      return null;
    }

    let uploadedImageUrl = null;
    if (raid.Banner) {
      const imageUrl = 'https://xivapi.com' + raid.Banner;
      const fileName = imageUrl.split('/').pop().split('.png')[0];
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'raids', fileName);
    }

    // Get the highest existing ID
    const highest = await db.raid.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    const nextId = highest ? highest.id + 1 : 1;

    return await db.raid.create({
      data: {
        id: nextId,
        name: raid.Name,
        description: raid.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating raid ${raid.Name}:`, error);
    return null;
  }
}

export default async function transformRaids() {
  const raids = await getRaids();
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < raids.length; i++) {
    const raid = raids[i];
    if (raid.Name && raid.Description && raid.Banner) {
      const result = await createRaid(raid);
      if (result) {
        successCount++;
      } else {
        // If result is null, it might be because the raid already exists
        skipCount++;
      }
    } else {
      skipCount++;
    }
    
    console.log(`Processed ${i + 1} out of ${raids.length} raids. Success: ${successCount}, Failed: ${failCount}, Skipped: ${skipCount}`);
  }

  console.log(`Finished processing all raids. Total Success: ${successCount}, Total Failed: ${failCount}, Total Skipped: ${skipCount}`);
}