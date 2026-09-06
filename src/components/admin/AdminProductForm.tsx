'use client';

import { useState } from 'react';
import { CloudinaryImageUploader } from '@/components/ui/CloudinaryImageUploader';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Sparkles, Trash2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductFormData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

interface AdminProductFormProps {
  initialData?: ProductFormData;
  action: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
}

const CATEGORIES = [
  { value: 'Sketch', label: 'Sketch — Charcoal & Pencil Portraits' },
  { value: 'Canvas', label: 'Canvas — Acrylic & Heritage Paintings' },
  { value: 'Wall Art', label: 'Wall Art — Cafe, Temple & Living Murals' },
  { value: 'Craft', label: 'Craft — Resin, Bottle Art & Keepsakes' },
];

export function AdminProductForm({
  initialData,
  action,
  isEditing = false,
}: AdminProductFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [imagesText, setImagesText] = useState<string>(
    initialData?.images ? initialData.images.join('\n') : '',
  );

  const handleCloudinaryUpload = (url: string) => {
    setImages((prev) => {
      const updated = [...prev, url];
      setImagesText(updated.join('\n'));
      return updated;
    });
  };

  const handleTextareaChange = (val: string) => {
    setImagesText(val);
    const parsed = val
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);
    setImages(parsed);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setImagesText(updated.join('\n'));
  };

  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
          Title *
        </label>
        <Input
          name="title"
          required
          defaultValue={initialData?.title || ''}
          className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
          placeholder="e.g. Royal Bridal Varmala Floral Preservation"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Slug (URL Identifier) *
          </label>
          <Input
            name="slug"
            required
            defaultValue={initialData?.slug || ''}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra font-mono text-xs"
            placeholder="royal-bridal-varmala"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Category *
          </label>
          <select
            name="category"
            required
            defaultValue={initialData?.category || ''}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen focus:border-terra text-[13px] cursor-pointer"
          >
            <option value="">Select Studio Medium</option>
            {CATEGORIES.map((cat) => (
              <option
                key={cat.value}
                value={cat.value}
                className="bg-deep2 text-linen"
              >
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Price (₹) *
          </label>
          <Input
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={initialData?.price ?? ''}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
            placeholder="250"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Stock Quantity *
          </label>
          <Input
            name="stock"
            type="number"
            required
            defaultValue={initialData?.stock ?? 1}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
          Artwork Description *
        </label>
        <Textarea
          name="description"
          required
          rows={4}
          defaultValue={initialData?.description || ''}
          className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-[13px]"
          placeholder="Describe the medium, craftsmanship, archival materials, and story behind this artwork..."
        />
      </div>

      {/* Cloudinary Direct Image Uploader */}
      <div className="p-5 bg-deep2/60 border border-terra/30 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-terra-pale flex items-center gap-2">
            <Sparkles size={14} className="text-terra" />
            <span>Cloudinary Image Assets</span>
          </label>
          <span className="text-[10px] font-mono text-linen/50">
            Auto-hosted on Cloudinary CDN
          </span>
        </div>

        <CloudinaryImageUploader
          folder="Vinyas/products"
          multiple={true}
          label="Upload Artwork Photos to Cloudinary"
          onUploadSuccess={handleCloudinaryUpload}
        />

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((imgUrl, i) => (
              <div
                key={i}
                className="relative group border border-linen/20 bg-black/40 overflow-hidden aspect-square"
              >
                <img
                  src={imgUrl}
                  alt={`Artwork preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-900/80 text-white hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-linen/50 mb-1.5">
            Direct Image URLs (Auto-populated by Cloudinary uploader, or paste
            custom URLs):
          </label>
          <Textarea
            name="images"
            rows={3}
            value={imagesText}
            onChange={(e) => handleTextareaChange(e.target.value)}
            className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-xs font-mono"
            placeholder="https://res.cloudinary.com/dcma5tbqk/image/upload/..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          className="h-[48px] px-8 bg-terra text-linen font-bold text-[11px] uppercase tracking-[0.12em] hover:bg-terra-dark transition-colors cursor-pointer shadow-neo"
        >
          {isEditing ? 'Save Changes' : 'Create Artwork'}
        </button>
        <Link
          href="/admin/products"
          className="h-[48px] px-8 border border-linen/20 text-linen font-bold text-[11px] uppercase tracking-[0.12em] flex items-center hover:bg-linen/5 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
