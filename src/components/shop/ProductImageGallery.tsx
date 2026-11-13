'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
  title: string;
  badges?: React.ReactNode;
  soldOverlay?: boolean;
}

export function ProductImageGallery({
  images,
  title,
  badges,
  soldOverlay = false,
}: ProductImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const safeImages = images.length > 0 ? images : ['/placeholder.jpg'];
  const current = safeImages[activeIdx] || '/placeholder.jpg';

  const prev = () => setActiveIdx((i) => (i - 1 + safeImages.length) % safeImages.length);
  const next = () => setActiveIdx((i) => (i + 1) % safeImages.length);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-charcoal/5 border-2 border-charcoal shadow-[8px_8px_0px_0px_rgba(45,45,45,1)]">
        <Image
          key={current}
          src={current}
          alt={`${title} — view ${activeIdx + 1}`}
          fill
          priority={activeIdx === 0}
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover transition-opacity duration-300"
        />

        {/* Badges slot */}
        {badges && (
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
            {badges}
          </div>
        )}

        {/* Sold overlay */}
        {soldOverlay && (
          <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px] flex items-center justify-center">
            <span className="font-serif text-3xl font-bold uppercase tracking-widest text-linen border-2 border-linen px-6 py-2 shadow-2xl">
              Made to Order
            </span>
          </div>
        )}

        {/* Prev / Next arrows — only when multiple images */}
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-linen/90 hover:bg-white border border-charcoal/30 flex items-center justify-center shadow-md transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} className="text-charcoal" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-linen/90 hover:bg-white border border-charcoal/30 flex items-center justify-center shadow-md transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={18} className="text-charcoal" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {safeImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === activeIdx ? 'bg-terra scale-125' : 'bg-linen/60 hover:bg-linen'
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIdx(i)}
              className={`relative w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-all ${
                i === activeIdx
                  ? 'border-terra shadow-md'
                  : 'border-charcoal/30 opacity-65 hover:opacity-100 hover:border-charcoal'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${title} — thumbnail ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

