import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getMinions() {
  const res = await fetch('https://ffxivcollect.com/api/minions');
  const data = await res.json();
  return data.results;
}

async function createMinion(minion) {
  try {
    // Check if the minion already exists
    const existingMinion = await db.minion.findFirst({
      where: { name: minion.name },
    });
    if (existingMinion) {
      console.log(`Minion ${minion.name} already exists. Skipping.`);
      return null;
    }

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
    console.error(`Error processing minion ${minion.name}:`, error);
    return null;
  }
}

export default async function transformMinions() {
  const minions = await getMinions();
  let newCount = 0;
  let existingCount = 0;
  let failCount = 0;

  for (let i = 0; i < minions.length; i++) {
    const minion = minions[i];
    const result = await createMinion(minion);
    if (result) {
      newCount++;
    } else if (result === null) {
      existingCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${minions.length} minions. New: ${newCount}, Existing: ${existingCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all minions. Total New: ${newCount}, Total Existing: ${existingCount}, Total Failed: ${failCount}`);
}
