import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/ui/Navbar';
import { ShopCatalog } from '@/components/shop/ShopCatalog';
import { FestiveBanner } from '@/components/shop/FestiveBanner';
import Link from 'next/link';
import { ArrowRight, Sparkles, Palette, ShieldCheck, HeartHandshake } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch products for shop page:', error);
  }

  const availableCount = products.filter((p) => p.stock > 0 && p.category !== 'Wall Art').length;
  const bespokeCount = products.filter((p) => p.stock === 0 || p.category === 'Wall Art').length;

  return (
    <div className="min-h-screen bg-linen selection:bg-terra selection:text-linen">
      <Navbar />

      {/* Main Page Container starting flush below Navbar (58px) */}
      <div className="pt-[58px]">
        <FestiveBanner />

        {/* Editorial Studio Brown Header */}
        <header className="relative border-b-1.5 border-charcoal bg-[#18100C] text-linen overflow-hidden">
          {/* Subtle Background Watermark */}
          <div
            className="absolute right-[-10px] top-[-20px] font-sans text-[110px] sm:text-[160px] lg:text-[210px] font-black tracking-tighter text-transparent select-none pointer-events-none z-0"
            style={{ WebkitTextStroke: '1px rgba(240, 235, 227, 0.05)' }}
          >
            VINYAS
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 px-6 md:px-16 py-10 lg:py-16">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 border border-terra/50 text-[#F5EFE6] text-[10px] font-bold tracking-widest uppercase mb-3.5 w-fit">
                <span className="text-terra-pale">✦</span>
                <span className="text-linen">Studio Vinyas · Ratangarh, Rajasthan</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-linen leading-[1.1] tracking-tight">
                Handcrafted Artworks &amp;
                <br />
                <em className="italic text-terra-pale font-normal">Bespoke Commissions.</em>
              </h1>

              <p className="text-xs sm:text-[13.5px] text-linen/80 leading-[1.75] mt-3 max-w-xl font-sans">
                Explore original mixed-media creations — from bridal Varmala resin flower preservations and hand-drawn charcoal portraits to custom cafe murals and textured canvas paintings.
              </p>

              {/* Trust Micro-Badges */}
              <div className="flex items-center gap-6 mt-6 pt-5 border-t border-linen/15 text-[11px] text-linen/70 font-sans flex-wrap">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-terra" />
                  <span>100% Artist Handcrafted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake size={14} className="text-terra" />
                  <span>Bespoke Personalization</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Palette size={14} className="text-terra" />
                  <span>On-Site Murals &amp; Courier</span>
                </div>
              </div>
            </div>

            {/* Right Metric Box & Fast Commission CTA */}
            <div className="lg:col-span-5 flex flex-col justify-center lg:border-l-1.5 lg:border-linen/15 lg:pl-10">
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                <div className="p-3 bg-linen/[0.04] border border-linen/15">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-linen leading-none mb-1">
                    {availableCount}
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-linen/70">
                    Ready to Ship
                  </div>
                </div>

                <div className="p-3 bg-linen/[0.04] border border-linen/15">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-terra-pale leading-none mb-1">
                    {bespokeCount}
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-linen/70">
                    Bespoke / Murals
                  </div>
                </div>

                <div className="p-3 bg-linen/[0.04] border border-linen/15">
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-linen leading-none mb-1">
                    100%
                  </div>
                  <div className="text-[9px] font-bold tracking-[0.14em] uppercase text-linen/70">
                    Authentic Art
                  </div>
                </div>
              </div>

              <div className="p-4 bg-terra/10 border border-terra/40 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <div className="text-xs font-bold text-linen">Have a custom request or Varmala?</div>
                  <div className="text-[10px] text-linen/70">Get a direct quote with Anki Matolia</div>
                </div>
                <Link
                  href="/commission"
                  className="inline-flex items-center gap-1.5 bg-terra hover:bg-terra-dark text-linen text-[10px] font-bold tracking-wider uppercase px-3.5 py-2 border border-terra transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]"
                >
                  <span>Commission Brief</span>
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Marquee Strip */}
        <div className="border-b-1.5 border-charcoal bg-[#120B07] text-linen py-2.5 overflow-hidden select-none border-t border-linen/10">
          <div className="marquee-inner flex whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <span key={i} className="flex items-center gap-6 text-[9.5px] font-bold tracking-[0.2em] uppercase text-linen/80">
                <span className="text-terra">✦ Studio Vinyas</span>
                <span>Wedding Varmala Preservation</span>
                <span className="text-terra">✦</span>
                <span>Handmade Charcoal &amp; Graphite Portraits</span>
                <span className="text-terra">✦</span>
                <span>Cafe &amp; Restaurant Wall Murals</span>
                <span className="text-terra">✦</span>
                <span>Textured Canvas &amp; Pichwai Paintings</span>
                <span className="text-terra">✦</span>
                <span>Illuminated Bottle Art</span>
                <span className="text-terra">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Interactive Shop Catalog & Filters */}
        <main className="w-full">
          <ShopCatalog initialProducts={products} />
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-charcoal text-linen border-t-2 border-charcoal py-10 px-6 md:px-16 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-linen block">
              VINYAS <span className="text-terra text-xs">✦ Studio</span>
            </span>
            <p className="text-[11px] text-linen/60 font-sans mt-0.5">
              By Anki Matolia · Ratangarh, Churu, Rajasthan
            </p>
          </div>
          <div className="flex items-center gap-6 text-[11px] tracking-wider uppercase text-linen/70 font-sans">
            <Link href="/portfolio" className="hover:text-terra transition-colors">3D Gallery</Link>
            <Link href="/commission" className="hover:text-terra transition-colors">Commissions</Link>
            <Link href="/about" className="hover:text-terra transition-colors">About Anki</Link>
            <Link href="/cart" className="hover:text-terra transition-colors font-bold text-terra">Cart</Link>
          </div>
          <p className="text-[10px] text-linen/40 font-mono">
            © {new Date().getFullYear()} Studio Vinyas. Handcrafted with soul.
          </p>
        </div>
      </footer>
    </div>
  );
}
