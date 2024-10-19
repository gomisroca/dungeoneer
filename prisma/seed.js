import { db } from '../src/server/db';
import supabase from '../src/supabase';

async function getMinions() {
  const res = await fetch('https://ffxivcollect.com/api/minions');
  const data = await res.json();
  return data.results;
}

async function transformMinions(){
  const minions = await getMinions();
  await Promise.all(
    minions.map(async (minion) => {
      const imageUrl = await uploadImage(minion.image, 'minions', minion.id + '.jpg');
      const dbMinion = await db.minion.create({
        data: {
          name: minion.name,
          shortDescription: description,
          description: minion.enhanced_description,
          patch: minion.patch,
          tradeable: minion.tradeable,
          behavior: minion.behavior.name,
          race: minion.race.name,
          image: imageUrl,
          owned: minion.owned,
        },
      })
      await db.verminionStats.create({
        data: {
          minionId: dbMinion.id,
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
      })
      for (const source of minion.sources) {
        await db.source.create({
          data: {
            minionId: dbMinion.id,
            type: source.type,
            text: source.text,
          },
        })
      }
    })
  );
}

async function uploadImage(imageUrl, bucketName, fileName) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image. Status: ${response.status}`);

    const blob = await response.blob();
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, blob, {
      contentType: blob.type,
      upsert: true,
    });

    if (error) throw new Error(`Failed to upload image to Supabase: ${error.message}`);

    console.log('Image uploaded successfully:', data);
    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

async function main() {
  // https://cafemaker.wakingsands.com/instanceContent?language=en // Dungeon Basic info
  // https://cafemaker.wakingsands.com/instanceContent/1?columns=Name,Banner&language=en // Dungeon Banner, could also just directly fetch these

  // https://ffxivcollect.com/api/minions
  // https://ffxivcollect.com/api/mounts
  // https://ffxivcollect.com/api/orchestrions
  // https://ffxivcollect.com/api/spells
  // https://triad.raelys.com/api/cards


  transformMinions();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });