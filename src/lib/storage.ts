import { supabaseBrowser } from "./supabase";

/**
 * Uploads a file to a Supabase storage bucket.
 * Returns the public URL of the uploaded file.
 * 
 * @param file The File object from an input field
 * @param bucket 'commissions' or 'products'
 * @param path The full path including filename within the bucket
 */
export async function uploadFile(file: File, bucket: string, path: string): Promise<string> {
  const { data, error } = await supabaseBrowser.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabaseBrowser.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrl;
}
