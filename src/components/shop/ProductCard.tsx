"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import Link from "next/link";
import Image from "next/image";
import { ArtworkCustomizerModal } from "./ArtworkCustomizerModal";
import { Sparkles, ShoppingBag, Eye, Heart, ArrowUpRight, Check, Brush } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  tag?: string;
  subcategory?: string;
  medium?: string;
  priority?: boolean;
  bentoVariant?: "standard" | "featured-large" | "wide";
  className?: string;
}

export function ProductCard({
  product,
  tag,
  subcategory,
  medium,
  priority = false,
  bentoVariant = "standard",
  className = "",
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isSold = product.stock <= 0;
  const isMural = product.category === "Wall Art";
  const isSketch = product.category === "Sketch" || product.title.toLowerCase().includes("portrait") || product.title.toLowerCase().includes("sketch");
  const isCraftOrResin = product.category === "Craft" || (subcategory && subcategory.includes("Resin")) || product.title.toLowerCase().includes("resin") || product.title.toLowerCase().includes("varmala") || product.title.toLowerCase().includes("keepsake");
  const isCustomizable = isMural || isSketch || isCraftOrResin || isSold;

  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      slug: product.slug,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted((prev) => !prev);
  };

  const handleOpenCustomizer = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCustomizerOpen(true);
  };

  const getBadgeLabel = () => {
    if (tag) return tag;
    if (isMural) return "Bespoke Mural";
    if (isSketch) return "Custom Portrait";
    if (isCraftOrResin) return subcategory?.includes("Resin") ? "Floral Keepsake" : "Handmade Craft";
    if (isSold) return "Made to Order";
    return "Studio Original";
  };

  // 1. FEATURED LARGE BENTO CARD (2x2 or prominent showcase)
  if (bentoVariant === "featured-large") {
    return (
      <>
        <div className={`group relative md:col-span-2 md:row-span-2 bg-[#1C1410] border-2 border-charcoal text-linen flex flex-col justify-between transition-all duration-300 hover:shadow-[8px_8px_0px_0px_#C17B5C] ${className}`}>
          
          {/* Media Header Container */}
          <div className="relative aspect-[16/10] md:aspect-[16/11] w-full overflow-hidden bg-charcoal/20 border-b-1.5 border-charcoal/40">
            <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-0 block">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410] via-transparent to-black/30 opacity-70" />
            </Link>

            {/* Badges & Spotlight Tag */}
            <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
              <span className="text-[9.5px] font-bold uppercase tracking-widest px-2.5 py-1 bg-terra text-linen shadow-md border border-terra/80 flex items-center gap-1.5">
                <Sparkles size={11} className="text-terra-pale" />
                <span>Spotlight Feature</span>
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-linen/95 text-charcoal shadow-md border border-charcoal/30">
                {getBadgeLabel()}
              </span>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3.5 right-3.5 z-10 w-8 h-8 flex items-center justify-center border-1.5 border-linen/40 bg-charcoal/80 hover:bg-white hover:text-charcoal text-linen transition-all shadow-md ${
                isWishlisted ? "!bg-terra !text-linen !border-terra" : ""
              }`}
              aria-label="Wishlist item"
            >
              <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Details & Actions Footer */}
          <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4 bg-[#1C1410]">
            <div>
              <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-widest text-terra-pale/80 mb-1">
                <span>{subcategory || product.category} · Studio Masterpiece</span>
                <span className="text-terra-pale font-bold">
                  {isMural ? "On-Site / Panel" : "Rajasthan Craft"}
                </span>
              </div>

              <Link href={`/shop/${product.slug}`}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-linen group-hover:text-terra-pale transition-colors line-clamp-1 leading-snug">
                  {product.title}
                </h3>
              </Link>

              {medium && (
                <p className="text-xs text-linen/75 line-clamp-2 font-sans mt-1 leading-relaxed">
                  {medium} — Created with soulful precision by Anki Matolia at Studio Vinyas.
                </p>
              )}
            </div>

            {/* Price & Action Row */}
            <div className="pt-4 border-t border-linen/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-linen/50 uppercase tracking-widest block font-mono">
                  {isMural ? "Starting Quote" : isCustomizable ? "Customizable Base Price" : "Original Price"}
                </span>
                <span className="font-serif font-bold text-2xl sm:text-3xl text-terra-pale block leading-none mt-0.5">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {isMural ? (
                  <button
                    onClick={handleOpenCustomizer}
                    className="flex-1 sm:flex-none py-3 px-6 bg-terra hover:bg-terra-dark text-linen text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                  >
                    <Brush size={13} />
                    <span>Commission Mural →</span>
                  </button>
                ) : isCustomizable ? (
                  <button
                    onClick={handleOpenCustomizer}
                    className="flex-1 sm:flex-none py-3 px-6 bg-terra hover:bg-terra-dark text-linen text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                  >
                    <Sparkles size={13} className="text-terra-pale" />
                    <span>Customize &amp; Order →</span>
                  </button>
                ) : (
                  <button
                    onClick={handleQuickAdd}
                    className="flex-1 sm:flex-none py-3 px-6 bg-terra hover:bg-terra-dark text-linen text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
                  >
                    <ShoppingBag size={13} />
                    <span>{isAdded ? "Added to Cart ✓" : "+ Add to Bag"}</span>
                  </button>
                )}

                <Link
                  href={`/shop/${product.slug}`}
                  className="w-10 h-10 bg-linen/10 hover:bg-linen/20 border border-linen/30 text-linen flex items-center justify-center transition-colors"
                  title="View Artwork Details"
                >
                  <Eye size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ArtworkCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            slug: product.slug,
            category: product.category,
            stock: product.stock,
            subcategory,
            medium,
          }}
        />
      </>
    );
  }

  // 2. WIDE BENTO CARD (Horizontal layout across 2 columns)
  if (bentoVariant === "wide") {
    return (
      <>
        <div className={`group relative md:col-span-2 bg-white/70 border-1.5 border-charcoal hover:border-terra flex flex-col sm:flex-row justify-between transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(45,45,45,0.9)] overflow-hidden ${className}`}>
          
          {/* Left Media */}
          <div className="relative aspect-[4/3] sm:aspect-auto sm:w-5/12 overflow-hidden bg-charcoal/5 border-b-1.5 sm:border-b-0 sm:border-r-1.5 border-charcoal/20 shrink-0">
            <Link href={`/shop/${product.slug}`} className="absolute inset-0 block">
              <Image
                src={product.image}
                alt={product.title}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, 35vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </Link>

            <div className="absolute top-2.5 left-2.5 z-10">
              <span className="text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 bg-linen/95 text-charcoal border border-charcoal/30 shadow-sm">
                {getBadgeLabel()}
              </span>
            </div>
          </div>

          {/* Right Details */}
          <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3 bg-linen/20">
            <div>
              <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-charcoal/60 mb-0.5">
                <span>{subcategory || product.category}</span>
                <span className="text-terra font-bold">
                  {isMural ? "Bespoke" : isSketch ? "Portrait" : isCraftOrResin ? "Floral Keepsake" : "Original"}
                </span>
              </div>

              <Link href={`/shop/${product.slug}`}>
                <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal group-hover:text-terra transition-colors line-clamp-1 leading-snug">
                  {product.title}
                </h3>
              </Link>

              {medium && (
                <p className="text-[11px] text-charcoal/70 line-clamp-2 font-sans mt-0.5">
                  {medium}
                </p>
              )}
            </div>

            {/* Price & Actions */}
            <div className="pt-2.5 border-t border-charcoal/15 flex items-center justify-between gap-2">
              <div>
                <span className="font-serif font-bold text-lg text-charcoal block leading-none">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-[8px] text-charcoal/50 uppercase tracking-widest font-mono">
                  {isMural ? "Starting Quote" : isCustomizable ? "Customizable" : "Ready to Ship"}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {isMural ? (
                  <button
                    onClick={handleOpenCustomizer}
                    className="py-1.5 px-3 bg-terra text-linen text-[10px] font-bold uppercase tracking-wider hover:bg-terra-dark transition-colors"
                  >
                    Inquire Mural →
                  </button>
                ) : isCustomizable ? (
                  <button
                    onClick={handleOpenCustomizer}
                    className="py-1.5 px-3 bg-charcoal text-linen text-[10px] font-bold uppercase tracking-wider hover:bg-terra transition-colors"
                  >
                    Customize &amp; Order
                  </button>
                ) : (
                  <button
                    onClick={handleQuickAdd}
                    className="py-1.5 px-3 bg-charcoal text-linen text-[10px] font-bold uppercase tracking-wider hover:bg-terra transition-colors"
                  >
                    {isAdded ? "Added ✓" : "+ Add"}
                  </button>
                )}

                <Link
                  href={`/shop/${product.slug}`}
                  className="w-7 h-7 bg-white border border-charcoal/30 flex items-center justify-center text-charcoal hover:bg-linen transition-colors"
                  title="View"
                >
                  <Eye size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ArtworkCustomizerModal
          isOpen={isCustomizerOpen}
          onClose={() => setIsCustomizerOpen(false)}
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            slug: product.slug,
            category: product.category,
            stock: product.stock,
            subcategory,
            medium,
          }}
        />
      </>
    );
  }

  // 3. STANDARD BENTO TILE
  return (
    <>
      <div className={`group relative bg-white/60 border-1.5 border-charcoal hover:border-terra flex flex-col justify-between transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(45,45,45,0.9)] ${className}`}>
        
        {/* Card Media Container */}
        <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full overflow-hidden bg-charcoal/5 border-b-1.5 border-charcoal/20">
          <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-0 block">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Link>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1.5 max-w-[85%]">
            <span className={`text-[8.5px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-sm border backdrop-blur-md ${
              isMural 
                ? "bg-terra text-linen border-terra"
                : isCraftOrResin
                ? "bg-[#D4A5A5] text-charcoal border-charcoal/30 font-bold"
                : isSketch
                ? "bg-charcoal text-linen border-charcoal"
                : "bg-linen/95 text-charcoal border-charcoal/30"
            }`}>
              {getBadgeLabel()}
            </span>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 flex items-center justify-center border-1.5 border-charcoal/40 bg-linen/90 hover:bg-white text-charcoal transition-all shadow-sm ${
              isWishlisted ? "!bg-terra !text-linen !border-terra" : ""
            }`}
            aria-label="Wishlist item"
          >
            <Heart size={12} fill={isWishlisted ? "currentColor" : "none"} />
          </button>

          {/* Hover Floating Action Bar */}
          <div className="absolute bottom-2.5 inset-x-2.5 z-10 flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {isMural ? (
              <button
                onClick={handleOpenCustomizer}
                className="flex-1 py-2 px-3 bg-terra hover:bg-terra-dark text-linen text-[10px] font-bold tracking-wider uppercase border border-charcoal flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <span>Commission Mural</span>
                <ArrowUpRight size={12} />
              </button>
            ) : isCustomizable ? (
              <button
                onClick={handleOpenCustomizer}
                className="flex-1 py-2 px-3 bg-charcoal hover:bg-terra text-linen text-[10px] font-bold tracking-wider uppercase border border-charcoal flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Sparkles size={11} className="text-terra-pale" />
                <span>Customize &amp; Order</span>
              </button>
            ) : (
              <button
                onClick={handleQuickAdd}
                className={`flex-1 py-2 px-3 text-[10px] font-bold tracking-wider uppercase border border-charcoal flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer ${
                  isAdded
                    ? "bg-moss text-linen border-moss"
                    : "bg-charcoal hover:bg-terra text-linen"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={12} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={12} />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            )}

            <Link
              href={`/shop/${product.slug}`}
              className="w-8 h-8 bg-linen/95 hover:bg-white text-charcoal border border-charcoal flex items-center justify-center shadow-sm flex-shrink-0"
              title="View Artwork Details"
            >
              <Eye size={13} />
            </Link>
          </div>
        </div>

        {/* Card Details Bottom Section */}
        <div className="p-3.5 flex flex-col justify-between flex-1 gap-2 bg-linen/20">
          <div>
            <div className="flex items-center justify-between gap-1 text-[9px] font-mono uppercase tracking-widest text-charcoal/55 mb-0.5">
              <span>{subcategory || product.category}</span>
              <span className="text-[8.5px] font-bold text-terra-dark">
                {isMural ? "On-Site / Panel" : isSketch ? "Hand-Drawn" : isCraftOrResin ? "Studio Crafted" : "Original"}
              </span>
            </div>

            <Link href={`/shop/${product.slug}`}>
              <h3 className="font-serif text-[14.5px] sm:text-[15.5px] font-bold text-charcoal group-hover:text-terra transition-colors line-clamp-1 leading-snug">
                {product.title}
              </h3>
            </Link>

            {medium && (
              <p className="text-[10px] text-charcoal/65 line-clamp-1 font-sans mt-0.5">
                {medium}
              </p>
            )}
          </div>

          {/* Price & Action Strip */}
          <div className="pt-2 border-t border-charcoal/15 flex items-center justify-between gap-2">
            <div>
              <span className="font-serif font-bold text-[15px] sm:text-base text-charcoal block leading-none">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[8px] text-charcoal/50 uppercase tracking-widest font-mono">
                {isMural ? "Starting Quote" : isCustomizable ? "Customizable" : "Ready to Ship"}
              </span>
            </div>

            {/* Mobile / Direct Button */}
            {isMural ? (
              <button
                onClick={handleOpenCustomizer}
                className="text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 bg-terra/15 text-terra-dark border border-terra/40 hover:bg-terra hover:text-linen transition-colors cursor-pointer"
              >
                Inquire
              </button>
            ) : isCustomizable ? (
              <button
                onClick={handleOpenCustomizer}
                className="text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 bg-charcoal/10 text-charcoal hover:bg-charcoal hover:text-linen transition-colors border border-charcoal/30 cursor-pointer"
              >
                Customize
              </button>
            ) : (
              <button
                onClick={handleQuickAdd}
                className={`text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 transition-colors border cursor-pointer ${
                  isAdded
                    ? "bg-moss text-linen border-moss"
                    : "bg-charcoal text-linen border-charcoal hover:bg-terra hover:border-terra"
                }`}
              >
                {isAdded ? "✓ Added" : "+ Add"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Customizer Modal */}
      <ArtworkCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          slug: product.slug,
          category: product.category,
          stock: product.stock,
          subcategory,
          medium,
        }}
      />
    </>
  );
}
