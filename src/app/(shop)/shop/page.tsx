import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/shop/ProductCard';
import { Navbar } from '@/components/ui/Navbar';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-linen">
      <Navbar />

      <header className="page-header" style={{ marginTop: '60px' }}>
        <div className="page-header-bg">SHOP</div>
        <div className="dark-grid"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div>
            <div className="sec-label">The Collection</div>
            <h1 className="page-header-title">
              Original
              <br />
              <em>artworks.</em>
            </h1>
            <p className="text-[12.5px] text-linen/45 leading-[1.7] mt-4 max-w-[300px]">
              Every piece is one of a kind — painted, inked, and made by hand in
              a dusty studio in Jaipur.
            </p>
          </div>

          <div className="flex flex-col justify-center md:border-l md:border-terra/40 md:pl-12">
            <div className="flex gap-12 mb-8">
              <div>
                <div className="font-serif text-[36px] font-bold text-linen leading-none mb-2">
                  {products.filter((p) => p.stock > 0).length}
                </div>
                <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-linen/35">
                  Available
                </div>
              </div>
              <div>
                <div className="font-serif text-[36px] font-bold text-linen leading-none mb-2">
                  {products.filter((p) => p.stock === 0).length}
                </div>
                <div className="text-[9px] font-bold tracking-[0.18em] uppercase text-linen/35">
                  Sold
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-linen/10">
              <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-linen/35 mb-4">
                Browse by medium
              </div>
              <div className="flex gap-2 flex-wrap">
                {['Watercolour', 'Oil', 'Ink', 'Acrylic', 'Mixed Media'].map(
                  (m, idx) => (
                    <button
                      key={m}
                      className={`text-[8px] font-bold tracking-[0.1em] uppercase px-[14px] py-[6px] border transition-colors ${idx === 0 ? 'bg-terra border-terra text-linen' : 'border-linen/20 text-linen/45 hover:bg-terra hover:border-terra hover:text-linen'}`}
                    >
                      {m}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-inner">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex">
              <span className="marquee-item">Original Paintings</span>
              <span className="marquee-sep">✦</span>
              <span className="marquee-item">Custom Commissions</span>
              <span className="marquee-sep">✦</span>
              <span className="marquee-item">Handmade Goods</span>
              <span className="marquee-sep">✦</span>
              <span className="marquee-item">Watercolour Art</span>
              <span className="marquee-sep">✦</span>
              <span className="marquee-item">Ink Illustrations</span>
              <span className="marquee-sep">✦</span>
              <span className="marquee-item">Limited Editions</span>
              <span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="shop-filter-bar !top-[59px]">
        <div className="filter-pills">
          <button className="filter-pill active">All</button>
          <button className="filter-pill">Watercolour</button>
          <button className="filter-pill">Oil</button>
          <button className="filter-pill">Ink</button>
          <button className="filter-pill">Acrylic</button>
          <button className="filter-pill">Mixed Media</button>
        </div>
        <div className="sort-dropdown">
          Sort:
          <select className="bg-transparent border-none outline-none font-bold cursor-none appearance-none font-sans text-[10px] tracking-wider uppercase text-charcoal">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Shop Grid Section */}
      <section className="section !py-[120px]">
        <div className="section-header">
          <div>
            <div className="sec-label">The Collection</div>
            <h2 className="section-heading">
              Available <em>Works.</em>
            </h2>
          </div>
          <p className="text-[14px] font-serif italic text-charcoal/45">
            {products.length} Pieces
          </p>
        </div>

        <div className="product-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                image: product.images[0] || '/placeholder.jpg',
              }}
              priority={index === 0}
            />
          ))}
        </div>

        {/* Commission Nudge */}
        <div className="px-16 mt-12">
          <div className="cta-banner reveal visible">
            <div className="cta-text">
              <h4>Looking for something specific?</h4>
              <p>
                Open for custom ink commissions. Limited slots available this
                month.
              </p>
            </div>
            <Link
              href="/#commission"
              className="btn-outline flex items-center gap-2 text-[10px]"
            >
              Request Commission <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Basic Footer */}
      <footer className="bg-deep border-t border-linen/[0.07] py-[52px] px-16">
        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Inkbloom Studio. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
