import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getMounts() {
  const res = await fetch('https://ffxivcollect.com/api/mounts');
  const data = await res.json();
  return data.results;
}

async function createMount(mount) {
  try {
    let uploadedImageUrl = null;
    if (mount.image) {
      const fileName = `${mount.id}.${mount.image.split('.').pop()}`;
      uploadedImageUrl = await uploadImageToSupabase(mount.image, 'mounts', fileName);
    }

    return await db.mount.create({
      data: {
        name: mount.name,
        shortDescription: mount.description,
        description: mount.enhanced_description,
        patch: mount.patch,
        tradeable: mount.tradeable,
        image: uploadedImageUrl ?? mount.image,
        owned: mount.owned,
        sources: {
          create: mount.sources.map((source) => ({
            type: source.type,
            text: source.text,
          })),
        },
      }
    });
  } catch (error) {
    console.error(`Error creating mount ${mount.name}:`, error);
    return null;
  }
}

export default async function transformMounts() {
  const mounts = await getMounts();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < mounts.length; i++) {
    const mount = mounts[i];
    const result = await createMount(mount);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
    console.log(`Processed ${i + 1} out of ${mounts.length} mounts. Success: ${successCount}, Failed: ${failCount}`);
  }

  console.log(`Finished processing all mounts. Total Success: ${successCount}, Total Failed: ${failCount}`);
}