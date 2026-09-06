/**
 * Uploads a file (or base64 string) to Cloudinary via the server upload endpoint.
 * Returns the secure Cloudinary HTTPS URL of the uploaded image.
 *
 * @param file The File object from an input field, or base64 string
 * @param folder Cloudinary folder (e.g. 'Vinyas/commissions', 'Vinyas/products', 'Vinyas/testimonials')
 */
export async function uploadFile(
  file: File | Blob | string,
  folder = 'Vinyas/uploads',
): Promise<string> {
  if (typeof file === 'string') {
    // Base64 or remote URL
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: file, folder }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload image to Cloudinary');
    }

    const data = await res.json();
    return data.url;
  }

  // File or Blob
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to upload image to Cloudinary');
  }

  const data = await res.json();
  return data.url;
}

export { uploadFile as uploadToCloudinary };
