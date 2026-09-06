import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Uploads a base64 string or file buffer directly to Cloudinary
 */
export async function uploadImageToCloudinary(
  fileData: string | Buffer,
  folder = "inkbloom/artworks"
): Promise<{ url: string; public_id: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    if (typeof fileData === "string") {
      // Base64 Data URL or remote URL
      cloudinary.uploader.upload(
        fileData,
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload error:", error);
            return reject(error || new Error("Failed to upload image to Cloudinary"));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      );
    } else {
      // Buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            console.error("Cloudinary upload error:", error);
            return reject(error || new Error("Failed to upload buffer to Cloudinary"));
          }
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      );
      uploadStream.end(fileData);
    }
  });
}
