import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Truck, Sparkles, ArrowRight, Heart } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { VINYAS_CATALOG } from "@/data/artworks";

export const dynamic = 'force-dynamic';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    notFound();
  }

  // Find rich metadata from catalog if available
  const meta = VINYAS_CATALOG.find(
    (a) => slugify(a.title) === slug || a.title.toLowerCase().trim() === product.title.toLowerCase().trim()
  );

  // Fetch recommendations from same category or others
  const recommendations = await prisma.product.findMany({
    where: { id: { not: product.id } },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const isSold = product.stock <= 0;
  const isMural = product.category === "Wall Art";

  return (
    <div className="min-h-screen bg-linen selection:bg-terra selection:text-linen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-16 pt-24 pb-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-charcoal/50 mb-8 font-sans">
          <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-charcoal transition-colors">Shop</Link>
          <span>›</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-charcoal transition-colors font-medium">
            {product.category}
          </Link>
          <span>›</span>
          <span className="text-charcoal font-semibold truncate max-w-xs">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16">
          {/* LEFT — Image Gallery Column (55%) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-charcoal/5 border-2 border-charcoal shadow-[8px_8px_0px_0px_rgba(45,45,45,1)]">
              <Image
                src={product.images[0] || "/placeholder.jpg"}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {meta?.tag && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-linen text-charcoal border border-charcoal/30 shadow-md">
                    {meta.tag}
                  </span>
                )}
                {isMural && (
                  <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-terra text-linen shadow-md">
                    Bespoke Mural
                  </span>
                )}
              </div>

              {isSold && !isMural && (
                <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="font-serif text-3xl font-bold uppercase tracking-widest text-linen border-2 border-linen px-6 py-2 shadow-2xl">
                    Made to Order
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails if multiple images exist */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative w-20 h-24 border-1.5 border-charcoal cursor-pointer flex-shrink-0 overflow-hidden ${
                      i === 0 ? "ring-2 ring-terra" : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`${product.title} view ${i + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info & Purchase Column (45%) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Subcategory Header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-terra/10 border border-terra/30 text-terra">
                  {product.category}
                </span>
                {meta?.subcategory && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal/60">
                    {meta.subcategory}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                {product.title}
              </h1>

              {/* Pricing & Valuation */}
              <div className="mt-4 pb-6 border-b border-charcoal/15 flex items-baseline gap-3">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-terra">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-charcoal/50 uppercase tracking-wider font-sans">
                  {isMural ? "Starting Commission" : "Includes Art Certificate"}
                </span>
              </div>

              {/* Actions: Add to Cart, Personalize, or Mural Commission */}
              <div className="mt-6 flex flex-col gap-3">
                <AddToCartButton
                  product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.images[0] || "/placeholder.jpg",
                    slug: product.slug,
                    category: product.category,
                    stock: product.stock,
                    subcategory: meta?.subcategory,
                    medium: meta?.medium,
                  }}
                  isSold={isSold}
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-charcoal/15 text-xs text-charcoal/80 font-sans">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-terra flex-shrink-0" />
                  <span>100% Handcrafted Original</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-terra flex-shrink-0" />
                  <span>All-India Safe Transit</span>
                </div>
              </div>

              {/* Story / About This Piece */}
              <div className="mt-8 pt-6 border-t border-charcoal/15">
                <h3 className="font-serif text-lg font-bold text-charcoal mb-2">About This Piece</h3>
                <p className="text-xs sm:text-[13px] text-charcoal/80 leading-relaxed font-sans">
                  {product.description}
                </p>
              </div>

              {/* Artwork Specifications Table */}
              <div className="mt-6 border border-charcoal/20 bg-charcoal/5 p-4 text-xs font-sans">
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Medium &amp; Technique</span>
                    <span className="font-semibold text-charcoal">{meta?.medium || `${product.category} Mixed Media`}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Dimensions</span>
                    <span className="font-semibold text-charcoal">{meta?.size || 'Bespoke Custom Size'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Studio Location</span>
                    <span className="font-semibold text-charcoal">Studio Vinyas · Ratangarh, Rajasthan</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block">Artist</span>
                    <span className="font-semibold text-charcoal">Anki Matolia</span>
                  </div>
                </div>
              </div>

              {/* Shipping & Handling */}
              <div className="mt-6 p-4 border border-terra/30 bg-terra/5 text-xs font-sans text-charcoal/80 flex items-start gap-3">
                <Sparkles size={16} className="text-terra flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {isMural
                    ? "Murals are painted on-site across Rajasthan and major Indian cities. Includes custom surface preparation and anti-dust protective coating."
                    : meta?.subcategory === "Resin Art"
                    ? "Resin pieces are cast with crystal UV-resistant epoxy and shipped in reinforced wooden box frames with corner foam guards."
                    : "Packed in acid-free tissue and rigid shock-resistant casing. Ships within 3–6 working days from Ratangarh."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDATIONS SECTION */}
        {recommendations.length > 0 && (
          <section className="mt-24 pt-12 border-t-2 border-charcoal">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase text-terra mb-1">
                  More from Studio Vinyas
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
                  You Might Also <em>Love</em>
                </h2>
              </div>
              <Link href="/shop" className="btn-outline text-xs tracking-wider uppercase px-4 py-2">
                Explore Full Shop →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((p) => {
                const recMeta = VINYAS_CATALOG.find(
                  (a) => a.title.toLowerCase().trim() === p.title.toLowerCase().trim()
                );
                return (
                  <ProductCard
                    key={p.id}
                    product={{ ...p, image: p.images[0] || "/placeholder.jpg" }}
                    tag={recMeta?.tag}
                    subcategory={recMeta?.subcategory}
                    medium={recMeta?.medium}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-charcoal text-linen py-10 px-6 md:px-16 border-t border-linen/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-linen/60 font-sans">
            © {new Date().getFullYear()} Studio Vinyas · All rights reserved. Handcrafted by Anki Matolia.
          </p>
          <div className="flex gap-6 font-sans">
            <Link href="/portfolio" className="hover:text-terra transition-colors">3D Walkthrough</Link>
            <Link href="/commission" className="hover:text-terra transition-colors">Custom Commission</Link>
            <Link href="/about" className="hover:text-terra transition-colors">About the Artist</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
