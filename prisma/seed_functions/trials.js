import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getTrials() {
  const trials = [];
  // Trial IDs go from 20008 to 20097 (as of patch 7.05)
  for (let i = 20008; i < 20098; i++) {
    const trial = await fetch(`https://xivapi.com/instanceContent/${i}?columns=Name,Banner,Description&language=en`);
    const trialData = await trial.json();
    trials.push(trialData);
  }
  return trials;
}

async function createTrial(trial) {
  try {    
    // First check if the raid already exists
    const existingTrial = await db.trial.findFirst({
      where: {
        name: trial.Name
      }
    });

    if (existingTrial) {
      console.log(`Trial "${trial.Name}" already exists, skipping...`);
      return null;
    }
    let uploadedImageUrl = null;
    if (trial.Banner) {
      const imageUrl = 'https://xivapi.com' + trial.Banner;
      const fileName = imageUrl.split('/').pop().split('.png')[0];
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'trials', fileName);
    }

    // Get the highest existing ID
    const highest = await db.trial.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    const nextId = highest ? highest.id + 1 : 1;

    return await db.trial.create({
      data: {
        id: nextId,
        name: trial.Name,
        description: trial.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating trial ${trial.name}:`, error);
    return null;
  }
}

export default async function transformTrials() {
  const trials = await getTrials();
  let successCount = 0;
  let failCount = 0;
  let skipCount = 0;

  for (let i = 0; i < trials.length; i++) {
    const trial = trials[i];
    if(trial.Name && trial.Description && trial.Banner){
      const result = await createTrial(trial);
      if (result) {
        successCount++;
      } else {
        // If result is null, it might be because the raid already exists
        skipCount++;
      }
    } else {
      skipCount++;
    }
   
    console.log(`Processed ${i + 1} out of ${trials.length} trials. Success: ${successCount}, Failed: ${failCount}, Skipped: ${skipCount}`);
  }

  console.log(`Finished processing all trials.Total Success: ${successCount}, Total Failed: ${failCount}, Total Skipped: ${skipCount}`);
}