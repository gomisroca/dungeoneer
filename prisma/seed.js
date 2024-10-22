import { db } from '../src/server/db';
import supabase from '../src/supabase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function uploadImageToSupabase(imageUrl, bucketName, fileName) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image. Status: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: response.headers.get('content-type') || 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;
      if (!data) throw new Error('No data returned from upload.');

      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (urlError) throw urlError;
      if (!urlData.publicUrl) throw new Error('Failed to get public URL for the image.');

      return urlData.publicUrl;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === MAX_RETRIES) {
        console.error('Max retries reached. Failing.');
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

// Fetch, transform and create minions in batches
async function getMinions() {
  const res = await fetch('https://ffxivcollect.com/api/minions');
  const data = await res.json();
  return data.results;
}

async function createMinion(minion) {
  try {
    let uploadedImageUrl = null;
    if (minion.image) {
      const fileName = `${minion.id}.${minion.image.split('.').pop()}`;
      uploadedImageUrl = await uploadImageToSupabase(minion.image, 'minions', fileName);
    }
    const minionData = {
      name: minion.name,
      shortDescription: minion.description,
      description: minion.enhanced_description,
      patch: minion.patch,
      tradeable: minion.tradeable,
      behavior: minion.behavior.name,
      race: minion.race.name,
      image: uploadedImageUrl ?? minion.image,
      owned: minion.owned,
      sources: {
        create: minion.sources.map((source) => ({
          type: source.type,
          text: source.text,
        })),
      },
    };

    if (minion.verminion) {
      minionData.verminion = {
        create: {
          cost: minion.verminion.cost,
          attack: minion.verminion.attack,
          defense: minion.verminion.defense,
          hp: minion.verminion.hp,
          speed: minion.verminion.speed,
          aoe: minion.verminion.area_attack,
          skill: minion.verminion.skill,
          skillDescription: minion.verminion.skill_description,
          skillAngle: minion.verminion.skill_angle,
          skillCost: minion.verminion.skill_cost,
          skillType: minion.verminion.skill_type.name,
          eye: minion.verminion.eye,
          gate: minion.verminion.gate,
          shield: minion.verminion.shield,
        },
      };
    }

    return await db.minion.create({
      data: minionData,
    });
  } catch (error) {
    console.error(`Error creating minion ${minion.name}:`, error);
    return null;
  }
}

async function transformMinions() {
  const minions = await getMinions();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < minions.length; i++) {
    const minion = minions[i];
    const result = await createMinion(minion);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${minions.length} minions. Success: ${successCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all minions. Total Success: ${successCount}, Total Failed: ${failCount}`);
}

async function getDungeons() {
  const dungeons = [];
  for (let i = 1; i < 100; i++) {
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
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'dungeons', fileName);
    }


    return await db.dungeon.create({
      data: {
        name: dungeon.Name,
        description: dungeon.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating minion ${minion.name}:`, error);
    return null;
  }
}

async function transformDungeons() {
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

async function main() {
  try {
    await transformMinions();
    await transformDungeons();
  } catch (e) {
    console.error("An error occurred during the seeding process:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
  