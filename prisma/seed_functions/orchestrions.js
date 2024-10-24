import { db } from '../../src/server/db';

async function getOrchs() {
  const res = await fetch('https://ffxivcollect.com/api/orchestrions');
  const data = await res.json();
  return data.results;
}

async function createOrch(orch) {
  try {
    return await db.orchestrion.create({
      data: {
        name: orch.name,
        description: orch.description,
        patch: orch.patch,
        tradeable: orch.tradeable,
        image: '/orchestrion.png',
        owned: orch.owned,
        number: orch.number,
        sources: {
          create: {
            type: orch.category.name,
            text: orch.description,
          }
        },
      }
    });
  } catch (error) {
    console.error(`Error creating orchestrion ${orch.name}:`, error);
    return null;
  }
}

export default async function transformOrchs() {
  const orchs = await getOrchs();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < orchs.length; i++) {
    const orch = orchs[i];
    const result = await createOrch(orch);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${orchs.length} orchestrions. Success: ${successCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all orchestrions. Total Success: ${successCount}, Total Failed: ${failCount}`);
}