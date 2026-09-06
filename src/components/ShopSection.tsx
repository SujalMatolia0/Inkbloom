import Link from 'next/link';
import { ProductCard } from './shop/ProductCard';
import { VINYAS_CATALOG } from '@/data/artworks';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ProductProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
}

export function ShopSection({ products = [] }: { products?: ProductProps[] }) {
  // Build lookup for catalog metadata
  const metaMap = new Map();
  for (const art of VINYAS_CATALOG) {
    metaMap.set(art.title.toLowerCase().trim(), art);
  }

  // Determine Bento grid variant for homepage curated showcase
  const getFeaturedBentoVariant = (index: number): "featured-large" | "wide" | "standard" => {
    if (index === 0) return "featured-large"; // Hero spotlight card (spans 2x2)
    if (index === 3) return "wide";           // Wide horizontal card (spans 2 cols)
    return "standard";                        // Standard compact card
  };

  return (
    <section className="w-full py-16 md:py-24 bg-linen border-t-1.5 border-charcoal">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b-1.5 border-charcoal/20">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-terra font-mono mb-2">
              <Sparkles size={11} />
              <span>Studio Vinyas · Curated Catalog</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal tracking-tight leading-none">
              Featured <em className="italic font-normal text-terra">creations.</em>
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-charcoal hover:text-terra transition-colors pb-1 border-b-1.5 border-charcoal/40 hover:border-terra w-fit"
          >
            <span>Explore All 33+ Works</span>
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Curated Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 [grid-auto-flow:dense]">
          {products.map((product, index) => {
            const meta = metaMap.get(product.title.toLowerCase().trim());
            const bentoVariant = getFeaturedBentoVariant(index);

            return (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  image: product.images[0] || '/placeholder.jpg',
                }}
                tag={meta?.tag}
                subcategory={meta?.subcategory}
                medium={meta?.medium}
                priority={index === 0}
                bentoVariant={bentoVariant}
              />
            );
          })}
        </div>

        {/* Bottom Bespoke Commission Callout */}
        <div className="mt-12 p-6 bg-[#18110D] text-linen border-1.5 border-charcoal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[5px_5px_0px_0px_#C17B5C]">
          <div>
            <p className="text-xs sm:text-[13px] text-linen/90 font-sans leading-relaxed">
              Looking for a custom wedding varmala preservation, anniversary plaque, or wall mural?{' '}
              <span className="text-terra-pale font-bold">Anki creates bespoke commissions</span> — personalized with your sacred moments.
            </p>
          </div>
          <Link
            href="/commission"
            className="btn-primary text-[10.5px] font-bold tracking-wider uppercase px-4 py-2.5 whitespace-nowrap shrink-0"
          >
            Commission Bespoke Art →
          </Link>
        </div>
      </div>
    </section>
  );
}

