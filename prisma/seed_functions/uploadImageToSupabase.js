import supabase from './supabase';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export default async function uploadImageToSupabase(imageUrl, bucketName, fileName) {
  // Validate and sanitize fileName
  if (typeof fileName === 'number') {
    fileName = `${fileName}.png`;
  } else if (!fileName.includes('.')) {
    fileName = `${fileName}.png`;  // Add default extension if none exists
  }

  if (!imageUrl || !bucketName || !fileName) {
    console.error('Missing required parameters:', { imageUrl, bucketName, fileName });
    return null;
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Attempt ${attempt}: Fetching image from ${imageUrl}`);
      console.log(`Using fileName: ${fileName}`);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image. Status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      console.log(`Uploading to bucket: ${bucketName}, filename: ${fileName}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: 'image/png',  // Set explicit content type since we know it's PNG
          upsert: true,
        });

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      if (!uploadData) {
        throw new Error('No data returned from upload.');
      }

      console.log('Upload successful, data:', uploadData);
      
      const { data: urlData, error: urlError } = await supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);  // Use fileName directly instead of uploadData.path

      if (urlError) {
        throw new Error(`Failed to get public URL: ${urlError.message}`);
      }

      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for the image.');
      }

      console.log('Successfully generated public URL:', urlData.publicUrl);
      return urlData.publicUrl;

    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === MAX_RETRIES) {
        console.error('Max retries reached. Failing.');
        return null;
      }
      
      console.log(`Waiting ${RETRY_DELAY}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
  
  return null;
}