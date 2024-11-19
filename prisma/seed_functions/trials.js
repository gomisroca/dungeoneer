import { db } from '../../src/server/db';
import uploadImageToSupabase from './uploadImageToSupabase';

async function getTrials() {
  const trialsFetch = await fetch(`https://beta.xivapi.com/api/1/search?sheets=ContentFinderCondition&fields=Name,Image&transient=Description&query=ContentType.Name="Trials"&limit=500`);
  const trials = await trialsFetch.json();
  return trials.results;
}

async function createTrial(trial) {
  try {    
    // First check if the raid already exists
    const existingTrial = await db.trial.findFirst({
      where: {
        name: trial.fields.Name
      }
    });

    if (existingTrial) {
      console.log(`Trial "${trial.fields.Name}" already exists, skipping...`);
      return null;
    }
    let uploadedImageUrl = null;
    if (trial.fields.Image) {
      const imageUrl = `https://beta.xivapi.com/api/1/asset?path=${trial.fields.Image.path}&format=png`;
      const fileName = `${trial.fields.Image.id}.png`;
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
        name: trial.fields.Name,
        description: trial.transient.Description,
        image: uploadedImageUrl,
      },
    });
  } catch (error) {
    console.error(`Error creating trial ${trial.fields.Name}:`, error);
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
    if(trial.fields.Name && trial.transient.Description && trial.fields.Image.path){
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