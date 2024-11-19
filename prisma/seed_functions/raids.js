import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getRaids() {
  const raidsFetch = await fetch(`https://beta.xivapi.com/api/1/search?sheets=ContentFinderCondition&fields=Name,Image&transient=Description&query=ContentType.Name="Raids"&limit=500`);
  const raids = await raidsFetch.json();
  return raids.results;
}

async function createRaid(raid) {
  try {
    // First check if the raid already exists
    const existingRaid = await db.raid.findFirst({
      where: {
        name: raid.fields.Name
      }
    });

    if (existingRaid) {
      console.log(`Raid "${raid.fields.Name}" already exists, skipping...`);
      return null;
    }

    let uploadedImageUrl = null;
    if (raid.fields.Image) {
      const imageUrl = `https://beta.xivapi.com/api/1/asset?path=${raid.fields.Image.path}&format=png`;
      const fileName = `${raid.fields.Image.id}.png`;
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
        name: raid.fields.Name,
        description: raid.transient.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating raid ${raid.fields.Name}:`, error);
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
    if (raid.fields.Name && raid.transient.Description && raid.fields.Image.path) {
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