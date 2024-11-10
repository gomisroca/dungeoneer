import { db } from '../../src/server/db';

async function getOrchs() {
  const res = await fetch('https://ffxivcollect.com/api/orchestrions');
  const data = await res.json();
  return data.results;
}

async function createOrch(orch) {
  try {
    // Check if the orchestrion already exists
    const existingOrchestrion = await db.orchestrion.findFirst({
      where: { name: orch.name },
    });
    if (existingOrchestrion) {
      console.log(`Orchestrion ${orch.name} already exists. Skipping.`);
      return null;
    }
    
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
    console.error(`Error processing orchestrion ${orch.name}:`, error);
    return null;
  }
}

export default async function transformOrchs() {
  const orchs = await getOrchs();
  let newCount = 0;
  let existingCount = 0;
  let failCount = 0;

  for (let i = 0; i < orchs.length; i++) {
    const orch = orchs[i];
    const result = await createOrch(orch);
    if (result) {
      newCount++;
    } else if (result === null) {
      existingCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${orchs.length} orchestrions. New: ${newCount}, Existing: ${existingCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all orchestrions. Total New: ${newCount}, Total Existing: ${existingCount}, Total Failed: ${failCount}`);
}