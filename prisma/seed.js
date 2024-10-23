import transformDungeons from "./seed_functions/dungeons";
import transformMinions from "./seed_functions/minions";
import transformMounts from "./seed_functions/mounts";
import transformRaids from "./seed_functions/raids";
import transformTrials from "./seed_functions/trials";
import transformVariants from "./seed_functions/variant";

async function main() {
  try {
    await transformMinions();
    await transformMounts();
    await transformDungeons();
    await transformTrials();
    await transformRaids();
    await transformVariants();
  } catch (e) {
    console.error("An error occurred during the seeding process:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
  