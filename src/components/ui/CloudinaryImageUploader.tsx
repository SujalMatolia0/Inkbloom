"use client";

import { useState } from "react";
import { Upload, Loader2, Check, Sparkles, X, Image as ImageIcon } from "lucide-react";
import { uploadFile } from "@/lib/storage";

interface CloudinaryImageUploaderProps {
  folder?: string;
  onUploadSuccess: (url: string) => void;
  label?: string;
  multiple?: boolean;
}

export function CloudinaryImageUploader({
  folder = "inkbloom/artworks",
  onUploadSuccess,
  label = "Upload Image to Cloudinary",
  multiple = false,
}: CloudinaryImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setErrorMessage(null);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 15 * 1024 * 1024) {
          throw new Error(`File ${file.name} is too large. Max allowed size is 15MB.`);
        }

        const url = await uploadFile(file, folder);
        setUploadedUrls((prev) => [...prev, url]);
        onUploadSuccess(url);
      }
    } catch (error: any) {
      console.error("Cloudinary upload failed:", error);
      setErrorMessage(error.message || "Failed to upload image to Cloudinary.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative border-1.5 border-dashed border-terra/40 hover:border-terra bg-black/20 p-4 transition-all group flex flex-col items-center justify-center text-center cursor-pointer">
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          disabled={isUploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full disabled:cursor-not-allowed"
        />

        {isUploading ? (
          <div className="flex flex-col items-center py-2">
            <Loader2 size={24} className="animate-spin text-terra mb-2" />
            <span className="text-xs font-mono text-terra-pale tracking-wider uppercase font-bold">
              Uploading to Cloudinary CDN...
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center py-1">
            <div className="w-9 h-9 rounded-full bg-terra/10 border border-terra/30 flex items-center justify-center text-terra mb-2 group-hover:scale-110 transition-transform">
              <Upload size={16} />
            </div>
            <span className="text-xs font-mono font-bold text-linen tracking-wider uppercase">
              {label}
            </span>
            <span className="text-[10px] font-mono text-linen/50 mt-1">
              Drag & drop or click to upload PNG, JPG, WebP directly to Cloudinary
            </span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-red-950/40 border border-red-500/40 text-red-200 text-xs font-mono flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)}>
            <X size={13} />
          </button>
        </div>
      )}

      {/* Uploaded Thumbnails Preview */}
      {uploadedUrls.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-linen/50 block">
            Cloudinary Uploaded Assets ({uploadedUrls.length}):
          </span>
          <div className="flex flex-wrap gap-2">
            {uploadedUrls.map((url, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-2.5 py-1.5 bg-deep2 border border-terra/30 text-[11px] font-mono text-linen/90 max-w-full"
              >
                <ImageIcon size={12} className="text-terra shrink-0" />
                <span className="truncate max-w-[200px] text-[10px]">{url}</span>
                <Check size={12} className="text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
