import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getRaids() {
  const raids = [];
  // Raid IDs go from 30001 to 30134
  for (let i = 30001; i < 30135; i++) {
    const raid = await fetch(`https://cafemaker.wakingsands.com/instanceContent/${i}?columns=Name,Banner,Description&language=en`);
    const raidData = await raid.json();
    raids.push(raidData);
  }
  return raids;
}

async function createRaid(raid) {
  try {
    let uploadedImageUrl = null;
    if (raid.Banner) {
      const imageUrl = 'https://cafemaker.wakingsands.com' + raid.Banner;
      const fileName = imageUrl.split('/').pop().split('.png')[0];
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'raids', fileName);
    }


    return await db.raid.create({
      data: {
        name: raid.Name,
        description: raid.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating raid ${raid.name}:`, error);
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
    if(raid.Name && raid.Description && raid.Banner){
      const result = await createRaid(raid);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
    } else{
      skipCount++
    }
   
    console.log(`Processed ${i + 1} out of ${raids.length} raids. Success: ${successCount}, Failed: ${failCount}, Skipped: ${skipCount}`);
  }

  console.log(`Finished processing all raids. Total Success: ${successCount}, Total Failed: ${failCount}`);
}