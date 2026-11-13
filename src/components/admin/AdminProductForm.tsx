'use client';

import { useState, useTransition, useEffect } from 'react';
import { CloudinaryImageUploader } from '@/components/ui/CloudinaryImageUploader';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { toast } from '@/components/ui/Toast';
import { Sparkles, Trash2, Loader2, ArrowLeft, Plus, Flower2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ActionResult } from '@/app/admin/products/actions';
import type { AddOnOption } from '@/components/shop/ProductAddOns';

interface ProductFormData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  addOns?: AddOnOption[];
}

interface AdminProductFormProps {
  initialData?: ProductFormData;
  action: (formData: FormData) => Promise<ActionResult>;
  isEditing?: boolean;
}

const CATEGORIES = [
  { value: 'Sketch', label: 'Sketch — Charcoal & Pencil Portraits' },
  { value: 'Canvas', label: 'Canvas — Acrylic & Heritage Paintings' },
  { value: 'Wall Art', label: 'Wall Art — Cafe, Temple & Living Murals' },
  { value: 'Resin Art', label: 'Resin Art — Varmala & Floral Preservation' },
  { value: 'Pipe Cleaner', label: 'Pipe Cleaner — Handmade Bouquets & Stems' },
  { value: 'Home Decor', label: 'Home Decor — Wall Hangings, Thalis & Torans' },
  { value: 'Accessories', label: 'Accessories — Mobile Charms, Keychains & Badges' },
  { value: 'Craft', label: 'Craft — Handmade Crafts & Keepsakes' },
  { value: 'Other', label: 'Other — Custom & Miscellaneous Creations' },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AdminProductForm({
  initialData,
  action,
  isEditing = false,
}: AdminProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [price, setPrice] = useState<string>(initialData?.price != null ? String(initialData.price) : '');
  const [stock, setStock] = useState<string>(initialData?.stock != null ? String(initialData.stock) : '1');
  const [category, setCategory] = useState(initialData?.category ?? '');
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [imagesText, setImagesText] = useState(initialData?.images ? initialData.images.join('\n') : '');
  const [addOns, setAddOns] = useState<AddOnOption[]>(initialData?.addOns ?? []);

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  const handleCloudinaryUpload = (url: string) => {
    setImages((prev) => {
      if (prev.includes(url)) { toast.warning('Duplicate image', 'Already in the list.'); return prev; }
      const updated = [...prev, url];
      setImagesText(updated.join('\n'));
      return updated;
    });
  };

  const handleTextareaChange = (val: string) => {
    setImagesText(val);
    const parsed = val.split('\n').map((u) => u.trim()).filter((u) => u.length > 0).filter((u, i, a) => a.indexOf(u) === i);
    setImages(parsed);
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    setImagesText(updated.join('\n'));
  };

  // ── Add-on helpers ───────────────────────────────────────────────────────────
  const addNewAddOn = () => {
    setAddOns((prev) => [
      ...prev,
      { id: `addon-${Date.now()}`, label: '', pricePerUnit: 20, unit: 'flower', emoji: '🌸', max: 20 },
    ]);
  };
  const updateAddOn = (idx: number, patch: Partial<AddOnOption>) => {
    setAddOns((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)));
  };
  const removeAddOn = (idx: number) => {
    setAddOns((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cleanedAddOns = addOns.filter((a) => a.label.trim().length > 0);
    const formData = new FormData();
    formData.set('title', title);
    formData.set('slug', slug);
    formData.set('description', description);
    formData.set('price', price);
    formData.set('stock', stock);
    formData.set('category', category);
    formData.set('images', imagesText);
    formData.set('addOns', JSON.stringify(cleanedAddOns));

    startTransition(async () => {
      const result = await action(formData);
      if (result.ok) {
        toast.success(isEditing ? 'Artwork Updated!' : 'Artwork Created!', result.message);
        setTimeout(() => router.push('/admin/products'), 800);
      } else {
        toast.error('Something went wrong', result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">Title *</label>
        <Input name="title" required value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
          placeholder="e.g. Royal Bridal Varmala Floral Preservation" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Slug */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Slug <span className="ml-1 text-terra/60 normal-case font-normal tracking-normal">— auto-generated</span>
          </label>
          <Input name="slug" value={slug}
            onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }}
            onFocus={() => setSlugTouched(true)}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra font-mono text-xs"
            placeholder="auto-generated-from-title" />
          {slug && <p className="text-[10px] font-mono text-terra/60 mt-1">/shop/<span className="text-terra">{slug}</span></p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">Category *</label>
          <select name="category" required value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen focus:border-terra text-[13px] cursor-pointer">
            <option value="">Select Studio Medium</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-deep2 text-linen">{cat.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">Price (₹) *</label>
          <Input name="price" type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra" placeholder="250" />
        </div>
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">Stock Quantity *</label>
          <Input name="stock" type="number" required value={stock} onChange={(e) => setStock(e.target.value)}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra" />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">Artwork Description *</label>
        <Textarea name="description" required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-[13px]"
          placeholder="Describe the medium, craftsmanship, archival materials, and story behind this artwork..." />
      </div>

      {/* Cloudinary Image Uploader */}
      <div className="p-5 bg-deep2/60 border border-terra/30 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-terra-pale flex items-center gap-2">
            <Sparkles size={14} className="text-terra" /><span>Cloudinary Image Assets</span>
          </label>
          <span className="text-[10px] font-mono text-linen/50">Auto-hosted on Cloudinary CDN</span>
        </div>
        <CloudinaryImageUploader folder="Vinyas/products" multiple={true} label="Upload Artwork Photos to Cloudinary"
          onUploadSuccess={handleCloudinaryUpload} existingUrls={images} />
        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {images.map((imgUrl, i) => (
              <div key={imgUrl} className="relative group border border-linen/20 bg-black/40 overflow-hidden aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={`Artwork preview ${i + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 p-1 bg-red-900/80 text-white hover:bg-red-700 transition-colors opacity-0 group-hover:opacity-100" title="Remove image">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-[0.15em] text-linen/50 mb-1.5">Direct Image URLs:</label>
          <Textarea name="images" rows={3} value={imagesText} onChange={(e) => handleTextareaChange(e.target.value)}
            className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-xs font-mono"
            placeholder="https://res.cloudinary.com/dcma5tbqk/image/upload/..." />
        </div>
      </div>

      {/* ── Add-ons Section ─────────────────────────────────────────────────────── */}
      <div className="p-5 bg-deep2/60 border border-terra/20 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-terra-pale flex items-center gap-2">
            <Flower2 size={14} className="text-terra" /><span>Order Add-ons / Extras</span>
          </label>
          <span className="text-[10px] font-mono text-linen/50">Customer-selectable upgrades</span>
        </div>
        <p className="text-[11px] text-linen/50 font-sans">
          Add items customers can include at extra cost — e.g. extra flowers in a bouquet (₹20/flower), premium frame (+₹500), rush delivery, etc.
        </p>

        {addOns.length > 0 && (
          <div className="space-y-3">
            {addOns.map((addon, idx) => (
              <div
                key={addon.id}
                className="grid grid-cols-2 sm:grid-cols-[56px_minmax(0,1fr)_92px_104px_84px_40px] gap-3 items-end p-3.5 bg-deep2 border border-linen/10"
              >
                {/* Emoji */}
                <div className="min-w-0">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-linen/50 mb-1.5">
                    Icon
                  </label>
                  <input
                    type="text"
                    value={addon.emoji ?? ''}
                    onChange={(e) => updateAddOn(idx, { emoji: e.target.value })}
                    className="w-full min-w-0 h-10 px-1.5 bg-deep border border-linen/15 text-linen placeholder:text-linen/30 text-center text-base focus:outline-none focus:border-terra transition-colors"
                    placeholder="🌸"
                    maxLength={4}
                  />
                </div>
                {/* Label */}
                <div className="min-w-0 col-span-1 sm:col-span-1">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-linen/50 mb-1.5">
                    Label
                  </label>
                  <input
                    type="text"
                    value={addon.label}
                    onChange={(e) => updateAddOn(idx, { label: e.target.value })}
                    className="w-full min-w-0 h-10 px-3 bg-deep border border-linen/15 text-linen placeholder:text-linen/30 text-xs font-sans focus:outline-none focus:border-terra transition-colors"
                    placeholder="Extra Flower"
                  />
                </div>
                {/* Price */}
                <div className="min-w-0">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-linen/50 mb-1.5">
                    ₹ / Unit
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={addon.pricePerUnit}
                    onChange={(e) =>
                      updateAddOn(idx, { pricePerUnit: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full min-w-0 h-10 px-3 bg-deep border border-linen/15 text-linen placeholder:text-linen/30 text-xs font-mono focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
                {/* Unit */}
                <div className="min-w-0">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-linen/50 mb-1.5">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={addon.unit}
                    onChange={(e) => updateAddOn(idx, { unit: e.target.value })}
                    className="w-full min-w-0 h-10 px-3 bg-deep border border-linen/15 text-linen placeholder:text-linen/30 text-xs font-sans focus:outline-none focus:border-terra transition-colors"
                    placeholder="flower"
                  />
                </div>
                {/* Max */}
                <div className="min-w-0">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-linen/50 mb-1.5">
                    Max Qty
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={addon.max ?? 20}
                    onChange={(e) =>
                      updateAddOn(idx, { max: parseInt(e.target.value, 10) || 20 })
                    }
                    className="w-full min-w-0 h-10 px-3 bg-deep border border-linen/15 text-linen placeholder:text-linen/30 text-xs font-mono focus:outline-none focus:border-terra transition-colors"
                  />
                </div>
                {/* Remove */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeAddOn(idx)}
                    title="Remove option"
                    className="h-10 w-10 flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/15 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button type="button" onClick={addNewAddOn}
          className="flex items-center gap-2 px-4 py-2 border border-dashed border-linen/20 text-linen/60 hover:border-terra/60 hover:text-terra-pale text-[11px] font-mono uppercase tracking-wider transition-colors">
          <Plus size={13} />
          Add an Extra Option
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button type="submit" disabled={isPending}
          className="h-[48px] px-8 bg-terra text-linen font-bold text-[11px] uppercase tracking-[0.12em] hover:bg-terra-dark transition-colors cursor-pointer shadow-neo disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? (isEditing ? 'Saving…' : 'Creating…') : (isEditing ? 'Save Changes' : 'Create Artwork')}
        </button>
        <Link href="/admin/products"
          className="h-[48px] px-8 border border-linen/20 text-linen font-bold text-[11px] uppercase tracking-[0.12em] flex items-center hover:bg-linen/5 transition-colors">
          <ArrowLeft size={13} className="mr-2" />Cancel
        </Link>
      </div>
    </form>
  );
}
