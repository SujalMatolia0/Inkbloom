import Link from 'next/link';
import { ProductCard } from './shop/ProductCard';
import { VINYAS_CATALOG } from '@/data/artworks';

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

  return (
    <section className="section !py-24">
      <div className="section-header">
        <div>
          <div className="sec-label">Studio Vinyas · Collection</div>
          <h2 className="section-heading">Featured <em>creations.</em></h2>
        </div>
        <Link href="/shop" className="view-all flex items-center gap-1">
          <span>Explore All {products.length}+ Works</span>
          <span>→</span>
        </Link>
      </div>

      <div className="product-grid">
        {products.map((product, index) => {
          const meta = metaMap.get(product.title.toLowerCase().trim());
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
            />
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-10 px-6 md:px-16 pt-6 border-t border-charcoal/10">
        <p className="text-xs text-charcoal/70">
          Looking for a custom wedding varmala preservation, anniversary plaque, or wall mural?{' '}
          <span className="text-terra font-semibold">Anki creates bespoke commissions</span> — personalized with your sacred moments.
        </p>
        <Link href="/commission" className="btn-primary text-[10px] tracking-wider uppercase px-4 py-2 whitespace-nowrap">
          Commission Bespoke Art →
        </Link>
      </div>
    </section>
  );
}
