import supabase from '../../src/supabase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default async function uploadImageToSupabase(imageUrl, bucketName, fileName) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error(`Failed to fetch image. Status: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: response.headers.get('content-type') || 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;
      if (!data) throw new Error('No data returned from upload.');

      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      if (urlError) throw urlError;
      if (!urlData.publicUrl) throw new Error('Failed to get public URL for the image.');

      return urlData.publicUrl;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === MAX_RETRIES) {
        console.error('Max retries reached. Failing.');
        return null;
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
}