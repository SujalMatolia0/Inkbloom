'use client';

import { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Star,
  Quote,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/app/actions/testimonials';
import { CloudinaryImageUploader } from '@/components/ui/CloudinaryImageUploader';

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string | null;
  content: string;
  artworkTitle: string | null;
  rating: number;
  image: string | null;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
}

export function AdminTestimonialsManager({
  initialTestimonials,
}: {
  initialTestimonials: TestimonialItem[];
}) {
  const [testimonials, setTestimonials] =
    useState<TestimonialItem[]>(initialTestimonials);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    text: string;
    error?: boolean;
  } | null>(null);

  // Form fields
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [content, setContent] = useState('');
  const [artworkTitle, setArtworkTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [image, setImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [order, setOrder] = useState(0);

  const resetForm = () => {
    setClientName('');
    setClientRole('');
    setContent('');
    setArtworkTitle('');
    setRating(5);
    setImage('');
    setIsFeatured(true);
    setOrder(0);
    setEditingId(null);
    setIsCreating(false);
  };

  const startEdit = (item: TestimonialItem) => {
    setEditingId(item.id);
    setClientName(item.clientName);
    setClientRole(item.clientRole || '');
    setContent(item.content);
    setArtworkTitle(item.artworkTitle || '');
    setRating(item.rating);
    setImage(item.image || '');
    setIsFeatured(item.isFeatured);
    setOrder(item.order);
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !content.trim()) {
      setFeedback({
        text: 'Client Name and Testimonial Content are required.',
        error: true,
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    if (editingId) {
      // Update
      const res = await updateTestimonial(editingId, {
        clientName: clientName.trim(),
        clientRole: clientRole.trim(),
        content: content.trim(),
        artworkTitle: artworkTitle.trim(),
        rating: Number(rating),
        image: image.trim() || undefined,
        isFeatured,
        order: Number(order),
      });

      if (res.success && res.data) {
        setTestimonials((prev) =>
          prev.map((t) =>
            t.id === editingId ? (res.data as unknown as TestimonialItem) : t,
          ),
        );
        setFeedback({ text: 'Testimonial updated successfully!' });
        resetForm();
      } else {
        setFeedback({
          text: res.error || 'Failed to update testimonial',
          error: true,
        });
      }
    } else {
      // Create
      const res = await createTestimonial({
        clientName: clientName.trim(),
        clientRole: clientRole.trim(),
        content: content.trim(),
        artworkTitle: artworkTitle.trim(),
        rating: Number(rating),
        image: image.trim() || undefined,
        isFeatured,
        order: Number(order),
      });

      if (res.success && res.data) {
        setTestimonials((prev) => [
          res.data as unknown as TestimonialItem,
          ...prev,
        ]);
        setFeedback({ text: 'New Testimonial added successfully!' });
        resetForm();
      } else {
        setFeedback({
          text: res.error || 'Failed to create testimonial',
          error: true,
        });
      }
    }

    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    setLoading(true);
    const res = await deleteTestimonial(id);
    if (res.success) {
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      setFeedback({ text: 'Testimonial removed.' });
    } else {
      setFeedback({
        text: res.error || 'Failed to delete testimonial',
        error: true,
      });
    }
    setLoading(false);
  };

  const toggleFeatured = async (item: TestimonialItem) => {
    const newStatus = !item.isFeatured;
    const res = await updateTestimonial(item.id, { isFeatured: newStatus });
    if (res.success) {
      setTestimonials((prev) =>
        prev.map((t) =>
          t.id === item.id ? { ...t, isFeatured: newStatus } : t,
        ),
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-linen/10">
        <div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-terra block mb-1">
            ✦ Client Praise &amp; Collector Stories
          </span>
          <h1 className="font-serif text-3xl font-bold text-linen">
            Manage{' '}
            <em className="italic text-terra-pale font-normal">Testimonials</em>
          </h1>
          <p className="text-xs text-linen/60 mt-1 font-sans">
            Add and feature heartfelt client reviews, bride feedback, and
            collector testimonials.
          </p>
        </div>

        <button
          onClick={() => {
            if (isCreating) resetForm();
            else {
              resetForm();
              setIsCreating(true);
            }
          }}
          className="btn-primary py-2.5 px-5 text-xs font-bold tracking-wider uppercase flex items-center gap-2 w-fit cursor-pointer"
        >
          {isCreating ? <X size={14} /> : <Plus size={14} />}
          <span>{isCreating ? 'Close Form' : 'Add Testimonial'}</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 border text-xs flex items-center justify-between ${
            feedback.error
              ? 'bg-red-950/40 border-red-500/50 text-red-200'
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <span>{feedback.text}</span>
          <button
            onClick={() => setFeedback(null)}
            className="opacity-70 hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Testimonial Form */}
      {isCreating && (
        <form
          onSubmit={handleSave}
          className="p-6 bg-[#251810] border-1.5 border-terra/40 text-linen space-y-4 animate-fadeIn shadow-lg"
        >
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-terra-pale pb-2 border-b border-linen/10">
            <Quote size={15} />
            <span>
              {editingId ? 'Edit Client Testimonial' : 'Add New Testimonial'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Ananya & Siddharth R."
                className="w-full px-3.5 py-2.5 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none font-sans"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
                Client Role / Location
              </label>
              <input
                type="text"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                placeholder="e.g. Bride & Groom · Jaipur"
                className="w-full px-3.5 py-2.5 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none font-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
              Artwork Title / Commission Piece
            </label>
            <input
              type="text"
              value={artworkTitle}
              onChange={(e) => setArtworkTitle(e.target.value)}
              placeholder='e.g. 9" Hexagon Varmala Preservation / Charcoal Couple Portrait'
              className="w-full px-3.5 py-2.5 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none font-sans"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
              Testimonial Content / Story *
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did the client say about their artwork, turnaround time, or preservation quality..."
              className="w-full px-3.5 py-2.5 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none font-sans"
            />
          </div>

          {/* Cloudinary Client / Artwork Photo */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
              Client Photo or Preserved Artwork Image (Cloudinary)
            </label>
            <CloudinaryImageUploader
              folder="Vinyas/testimonials"
              label="Upload Client Photo to Cloudinary"
              onUploadSuccess={(url) => setImage(url)}
            />
            {image && (
              <div className="mt-2 flex items-center gap-2 p-2 bg-[#18100C] border border-terra/30 text-xs text-linen/80">
                <img
                  src={image}
                  alt="Preview"
                  className="w-8 h-8 rounded object-cover border border-linen/20"
                />
                <span className="truncate text-[10px] font-mono flex-1">
                  {image}
                </span>
                <button
                  type="button"
                  onClick={() => setImage('')}
                  className="text-red-400 hover:text-red-300 text-xs px-1"
                >
                  <X size={13} />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
                Star Rating
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      size={18}
                      className={
                        star <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-linen/30'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-linen/70 block mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#18100C] border border-linen/20 text-xs text-linen focus:border-terra outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 text-xs text-linen/90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="accent-terra w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold">Featured on Storefront</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-linen/10">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs uppercase font-bold tracking-wider text-linen/60 hover:text-linen"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-2.5 px-6 text-xs font-bold tracking-wider uppercase"
            >
              {loading
                ? 'Saving...'
                : editingId
                  ? 'Update Testimonial'
                  : 'Save Testimonial'}
            </button>
          </div>
        </form>
      )}

      {/* Testimonials List */}
      <div className="border border-linen/15 bg-[#1C1410] overflow-hidden shadow-md">
        <div className="p-4 border-b border-linen/10 bg-[#251810] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-linen/80">
            Collector Reviews ({testimonials.length})
          </span>
          <span className="text-[10px] text-linen/50 font-mono">
            {testimonials.filter((t) => t.isFeatured).length} Featured
          </span>
        </div>

        {testimonials.length === 0 ? (
          <div className="p-12 text-center text-linen/40 text-xs">
            No testimonials recorded yet. Click &ldquo;Add Testimonial&rdquo;
            above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-linen/10">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-linen/[0.02] transition-colors flex flex-col justify-between gap-3 border-b border-linen/10"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className="text-amber-400 fill-amber-400"
                        />
                      ))}
                    </div>
                    {item.isFeatured ? (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-terra/20 text-terra-pale border border-terra/40">
                        Featured
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-linen/10 text-linen/40">
                        Hidden
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-[13px] text-linen/90 font-sans italic leading-relaxed mb-3">
                    &ldquo;{item.content}&rdquo;
                  </p>

                  <div className="pt-2 border-t border-linen/10">
                    <div className="font-serif font-bold text-sm text-linen">
                      {item.clientName}
                    </div>
                    <div className="text-[10.5px] text-linen/60 font-sans">
                      {item.clientRole || 'Art Lover'}
                    </div>
                    {item.artworkTitle && (
                      <div className="text-[10px] font-mono text-terra-pale mt-0.5">
                        ✦ {item.artworkTitle}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-linen/10">
                  <button
                    onClick={() => toggleFeatured(item)}
                    title={
                      item.isFeatured ? 'Unfeature' : 'Feature on storefront'
                    }
                    className={`p-1.5 border text-xs transition-colors cursor-pointer ${
                      item.isFeatured
                        ? 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                        : 'border-linen/20 text-linen/40 hover:text-linen'
                    }`}
                  >
                    {item.isFeatured ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>

                  <button
                    onClick={() => startEdit(item)}
                    title="Edit Testimonial"
                    className="p-1.5 border border-linen/20 text-linen/70 hover:text-terra hover:border-terra bg-[#18100C] transition-colors cursor-pointer"
                  >
                    <Edit2 size={13} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    title="Delete Testimonial"
                    className="p-1.5 border border-red-500/30 text-red-400 hover:bg-red-950/40 hover:border-red-500 bg-[#18100C] transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
