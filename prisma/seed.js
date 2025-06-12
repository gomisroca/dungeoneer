import transformCards from "./seed_functions/cards";
import transformDungeons from "./seed_functions/dungeons";
import transformEmotes from "./seed_functions/emotes";
import transformHairstyles from "./seed_functions/hairstyles";
import transformMinions from "./seed_functions/minions";
import transformMounts from "./seed_functions/mounts";
import transformOrchs from "./seed_functions/orchestrions";
import transformRaids from "./seed_functions/raids";
import transformSpells from "./seed_functions/spells";
import transformTrials from "./seed_functions/trials";
import transformVariants from "./seed_functions/variant";
import updateDungeons from "./relation_functions/updateDungeons";
import updateRaids from "./relation_functions/updateRaids";
import updateTrials from "./relation_functions/updateTrials";
import updateVariants from "./relation_functions/updateVCDungeons";
import { db } from "../src/server/db";

async function main() {
  const seedFunctions = [
    { name: 'Dungeons', fn: transformDungeons },
    { name: 'Raids', fn: transformRaids },
    { name: 'Trials', fn: transformTrials },
    { name: 'Variant Dungeons', fn: transformVariants },
    { name: 'Cards', fn: transformCards },
    { name: 'Emotes', fn: transformEmotes },
    { name: 'Hairstyles', fn: transformHairstyles },
    { name: 'Minions', fn: transformMinions },
    { name: 'Mounts', fn: transformMounts },
    { name: 'Orchestrions', fn: transformOrchs },
    { name: 'Spells', fn: transformSpells }
  ];
  const updateFunctions = [
    { name: 'Dungeons', fn: updateDungeons },
    { name: 'Raids', fn: updateRaids },
    { name: 'Trials', fn: updateTrials },
    { name: 'Variant Dungeons', fn: updateVariants },
  ];

  try {
    for (const { name, fn } of seedFunctions) {
      console.log(`Starting to seed ${name}...`);
      await fn();
      console.log(`Finished seeding ${name}`);
    }
    console.log('All transformations completed successfully!');

    for (const { name, fn } of updateFunctions) {
      console.log(`Starting to update ${name}...`);
      await fn();
      console.log(`Finished updating ${name}`);
    }
    console.log('All updates completed successfully!');
  } catch (e) {
    console.error("An error occurred during the seeding process:", e);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
  