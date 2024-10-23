import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getTrials() {
  const trials = [];
  // Trial IDs go from 20008 to 20097
  for (let i = 20008; i < 20098; i++) {
    const trial = await fetch(`https://cafemaker.wakingsands.com/instanceContent/${i}?columns=Name,Banner,Description&language=en`);
    const trialData = await trial.json();
    trials.push(trialData);
  }
  return trials;
}

async function createTrial(trial) {
  try {
    let uploadedImageUrl = null;
    if (trial.Banner) {
      const imageUrl = 'https://cafemaker.wakingsands.com' + trial.Banner;
      const fileName = imageUrl.split('/').pop().split('.png')[0];
      uploadedImageUrl = await uploadImageToSupabase(imageUrl, 'trials', fileName);
    }


    return await db.trial.create({
      data: {
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
        failCount++;
      }
    } else{
      skipCount++
    }
   
    console.log(`Processed ${i + 1} out of ${trials.length} trials. Success: ${successCount}, Failed: ${failCount}, Skipped: ${skipCount}`);
  }

  console.log(`Finished processing all trials. Total Success: ${successCount}, Total Failed: ${failCount}`);
}