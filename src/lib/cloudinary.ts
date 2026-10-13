import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Uploads a public image (for products, blog posts, gallery)
 */
export async function uploadImageToCloudinary(
  fileData: string | Buffer,
  folder = 'Vinyas/artworks',
): Promise<{ url: string; public_id: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder,
      resource_type: 'image' as const,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    };

    if (typeof fileData === 'string') {
      cloudinary.uploader.upload(fileData, uploadOptions, (error, result) => {
        if (error || !result) {
          console.error('Cloudinary upload error:', error);
          return reject(error || new Error('Failed to upload image to Cloudinary'));
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
        });
      });
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error || !result) {
            console.error('Cloudinary upload error:', error);
            return reject(error || new Error('Failed to upload buffer to Cloudinary'));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        },
      );
      uploadStream.end(fileData);
    }
  });
}

/**
 * Uploads a PRIVATE authenticated reference image (for customer commissions)
 * Ensures photos remain private and unlisted from public CDN access.
 */
export async function uploadPrivateImageToCloudinary(
  fileBuffer: Buffer,
  folder = 'Vinyas/commissions_private',
): Promise<{ public_id: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        type: 'authenticated',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error || !result) {
          console.error('Cloudinary private upload error:', error);
          return reject(error || new Error('Failed to upload private reference image to Cloudinary'));
        }
        resolve({
          public_id: result.public_id,
          width: result.width,
          height: result.height,
        });
      },
    );
    uploadStream.end(fileBuffer);
  });
}

/**
 * Generates a signed, temporary authenticated URL for admin inspection.
 */
export function getPrivateImageUrl(publicId: string): string {
  if (!publicId) return '';
  return cloudinary.url(publicId, {
    type: 'authenticated',
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600, // Valid for 1 hour
  });
}

/**
 * Deletes a Cloudinary image (e.g. cleanup orphaned upload on DB failure)
 */
export async function deleteCloudinaryImage(
  publicId: string,
  type: 'authenticated' | 'upload' = 'authenticated',
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { type });
  } catch (err) {
    console.error('Failed to delete Cloudinary asset:', err);
  }
}
