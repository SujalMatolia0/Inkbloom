"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";
import { VINYAS_CATALOG, Artwork } from "@/data/artworks";
import { Search, SlidersHorizontal, X, Sparkles, Filter, Package, Brush, Layers, Palette, LayoutGrid, Grid3X3 } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
}

const CATEGORIES = [
  { id: "all", label: "All Works", icon: Sparkles },
  { id: "Wall Art", label: "Wall Art & Murals", icon: Brush },
  { id: "Sketch", label: "Sketches & Portraits", icon: Palette },
  { id: "Craft", label: "Craft & Keepsakes", icon: Package },
  { id: "Canvas", label: "Canvas Paintings", icon: Layers },
];

const CRAFT_SUBCATEGORIES = [
  { id: "all", label: "All Crafts" },
  { id: "Resin Art", label: "Floral & Varmala Preservation" },
  { id: "Bottle Art", label: "Illuminated Bottle Art" },
  { id: "Handmade Keepsake", label: "Milestone & Keepsake Platters" },
];

export function ShopCatalog({ initialProducts }: { initialProducts: Product[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCraftSub, setSelectedCraftSub] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [availabilityFilter, setAvailabilityFilter] = useState<"all" | "in-stock" | "commission">("all");
  const [layoutMode, setLayoutMode] = useState<"bento" | "grid">("bento");

  // Create lookup for catalog metadata (subcategory, tag, medium)
  const catalogLookup = useMemo(() => {
    const map = new Map<string, Artwork>();
    for (const art of VINYAS_CATALOG) {
      map.set(art.title.toLowerCase().trim(), art);
    }
    return map;
  }, []);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      const meta = catalogLookup.get(product.title.toLowerCase().trim());

      // 2. Craft Subcategory Filter
      if (selectedCategory === "Craft" && selectedCraftSub !== "all") {
        if (meta && meta.subcategory !== selectedCraftSub) {
          return false;
        }
      }

      // 3. Availability Filter
      if (availabilityFilter === "in-stock" && (product.stock <= 0 || product.category === "Wall Art")) {
        return false;
      }
      if (availabilityFilter === "commission" && product.stock > 0 && product.category !== "Wall Art") {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesSub = meta?.subcategory.toLowerCase().includes(query) || false;
        const matchesTag = meta?.tag.toLowerCase().includes(query) || false;
        if (!matchesTitle && !matchesDesc && !matchesCat && !matchesSub && !matchesTag) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") {
        return a.price - b.price;
      }
      if (sortBy === "price-desc") {
        return b.price - a.price;
      }
      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [initialProducts, selectedCategory, selectedCraftSub, availabilityFilter, searchQuery, sortBy, catalogLookup]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProducts.length };
    for (const p of initialProducts) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [initialProducts]);

  const hasActiveFilters = selectedCategory !== "all" || selectedCraftSub !== "all" || availabilityFilter !== "all" || searchQuery !== "";

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedCraftSub("all");
    setAvailabilityFilter("all");
    setSearchQuery("");
    setSortBy("featured");
  };

  // Determine Bento variant per index in Bento Mode
  const getBentoVariant = (index: number, product: Product) => {
    if (layoutMode !== "bento") return "standard";
    // First item is spotlight feature
    if (index === 0) return "featured-large";
    // Every 6th item or high-value mural / canvas is featured
    if (index % 7 === 0) return "featured-large";
    // Every 4th item is wide horizontal banner
    if (index % 4 === 3) return "wide";
    return "standard";
  };

  return (
    <div className="w-full">
      {/* Category Navigation Bar */}
      <div className="sticky top-[58px] z-30 bg-[#F0EBE3]/95 backdrop-blur-md border-b-1.5 border-charcoal px-6 md:px-16 py-3 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Main Category Tabs */}
          <div
            className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-0.5 no-scrollbar shrink-0 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedCraftSub("all");
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 text-[11px] font-bold tracking-wider uppercase whitespace-nowrap transition-all border-1.5 cursor-pointer ${
                    isActive
                      ? "bg-charcoal border-charcoal text-linen shadow-[2px_2px_0px_0px_rgba(193,123,92,1)]"
                      : "bg-[#F6F1EA] border-charcoal/25 text-charcoal/80 hover:border-charcoal hover:text-charcoal hover:bg-white"
                  }`}
                >
                  <Icon size={12} className={isActive ? "text-terra-pale" : "text-charcoal/60"} />
                  <span>{cat.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      isActive ? "bg-linen/20 text-linen" : "bg-charcoal/10 text-charcoal/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search, Sort & Layout Controls */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-60">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artworks..."
                className="w-full pl-8 pr-7 py-2 bg-[#F6F1EA] border-1.5 border-charcoal/30 text-xs text-charcoal placeholder:text-charcoal/45 font-sans focus:outline-none focus:border-terra transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 border-1.5 border-charcoal/30 bg-[#F6F1EA] px-2.5 py-2 text-xs text-charcoal">
              <SlidersHorizontal size={12} className="text-charcoal/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none outline-none font-sans text-[11px] font-bold tracking-wider uppercase text-charcoal cursor-pointer"
              >
                <option value="featured">Curated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="title-asc">Alphabetical</option>
              </select>
            </div>

            {/* Bento / Grid Layout Switcher */}
            <div className="hidden sm:flex items-center border-1.5 border-charcoal/30 bg-[#F6F1EA] p-0.5">
              <button
                onClick={() => setLayoutMode("bento")}
                title="Bento Editorial Layout"
                className={`p-1.5 transition-colors cursor-pointer ${
                  layoutMode === "bento" ? "bg-charcoal text-linen" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setLayoutMode("grid")}
                title="Uniform Grid Layout"
                className={`p-1.5 transition-colors cursor-pointer ${
                  layoutMode === "grid" ? "bg-charcoal text-linen" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                <Grid3X3 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Subcategory Filter Pills for Craft */}
        {selectedCategory === "Craft" && (
          <div className="max-w-7xl mx-auto pt-3 border-t border-charcoal/15 mt-3 flex items-center gap-2 flex-wrap animate-fadeIn">
            <span className="text-[10px] uppercase font-bold tracking-widest text-charcoal/60 mr-2">
              Craft Speciality:
            </span>
            {CRAFT_SUBCATEGORIES.map((sub) => {
              const isActive = selectedCraftSub === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedCraftSub(sub.id)}
                  className={`text-[10px] font-bold tracking-wide uppercase px-3 py-1 border-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-terra border-charcoal text-linen shadow-sm"
                      : "border-charcoal/25 text-charcoal/80 hover:border-charcoal hover:text-charcoal bg-[#F6F1EA]"
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-8">
        
        {/* Category Speciality Editorial Banners */}
        {selectedCategory === "Wall Art" && (
          <div className="mb-8 p-4 bg-[#1C1410] border-1.5 border-charcoal text-linen flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-terra text-linen rounded-sm flex-shrink-0 mt-0.5">
                <Brush size={16} />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-linen">Bespoke Wall Murals &amp; Commercial Installations</h4>
                <p className="text-xs text-linen/75 mt-0.5 font-sans">
                  Wall art and murals cannot be bought off-the-shelf. Click &ldquo;Commission Mural&rdquo; to send wall dimensions, surface details, and city location for an artist quote.
                </p>
              </div>
            </div>
            <Link
              href="/commission"
              className="btn-primary py-2 px-4 text-[10.5px] font-bold tracking-wider uppercase whitespace-nowrap"
            >
              Direct Inquiry →
            </Link>
          </div>
        )}

        {selectedCategory === "Sketch" && (
          <div className="mb-8 p-4 bg-white/90 border-1.5 border-charcoal/30 text-charcoal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-charcoal text-linen rounded-sm flex-shrink-0 mt-0.5">
                <Palette size={16} />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-charcoal">Custom Hand-Drawn Charcoal &amp; Graphite Portraits</h4>
                <p className="text-xs text-charcoal/70 mt-0.5 font-sans">
                  Choose face counts, paper sizes (A4, A3, A2), framing options, and upload reference photos directly in the customizer.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === "Craft" && (
          <div className="mb-8 p-4 bg-amber-50/90 border-1.5 border-amber-300 text-charcoal flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-700 text-linen rounded-sm flex-shrink-0 mt-0.5">
                <Package size={16} />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-amber-950">Floral Varmala Preservation &amp; Memory Keepsakes</h4>
                <p className="text-xs text-amber-900 mt-0.5 font-sans">
                  Wedding garlands and physical memorabilia are safely couriered to Studio Vinyas in Ratangarh, Rajasthan after booking.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results Bar & Active Filter Chips */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-charcoal/15 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="font-serif text-base sm:text-lg text-charcoal">
              Showing <span className="font-bold text-terra">{filteredProducts.length}</span> artworks
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-[11px] text-terra hover:text-charcoal font-bold tracking-wider uppercase underline underline-offset-4 cursor-pointer"
              >
                <X size={12} />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-1 border-1.5 border-charcoal/25 p-1 bg-white/80 text-[10px] font-bold tracking-widest uppercase">
            <button
              onClick={() => setAvailabilityFilter("all")}
              className={`px-3 py-1 transition-all cursor-pointer ${
                availabilityFilter === "all" ? "bg-charcoal text-linen shadow-sm" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              All Works
            </button>
            <button
              onClick={() => setAvailabilityFilter("in-stock")}
              className={`px-3 py-1 transition-all cursor-pointer ${
                availabilityFilter === "in-stock" ? "bg-charcoal text-linen shadow-sm" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              Ready to Ship
            </button>
            <button
              onClick={() => setAvailabilityFilter("commission")}
              className={`px-3 py-1 transition-all cursor-pointer ${
                availabilityFilter === "commission" ? "bg-charcoal text-linen shadow-sm" : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              Bespoke / Murals
            </button>
          </div>
        </div>

        {/* BENTO GRID / UNIFORM GRID DISPLAY */}
        {filteredProducts.length > 0 ? (
          <div
            className={`grid gap-6 md:gap-7 ${
              layoutMode === "bento"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 [grid-auto-flow:dense]"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {filteredProducts.map((product, index) => {
              const meta = catalogLookup.get(product.title.toLowerCase().trim());
              const bentoVariant = getBentoVariant(index, product);

              return (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    image: product.images[0] || "/placeholder.jpg",
                  }}
                  tag={meta?.tag}
                  subcategory={meta?.subcategory}
                  medium={meta?.medium}
                  priority={index < 4}
                  bentoVariant={bentoVariant}
                />
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 px-6 text-center border-2 border-dashed border-charcoal/20 bg-linen/50 my-6">
            <div className="w-14 h-14 mx-auto mb-3 flex items-center justify-center rounded-full bg-terra/10 text-terra">
              <Filter size={22} />
            </div>
            <h3 className="font-serif text-xl font-bold text-charcoal mb-1">No matching pieces</h3>
            <p className="text-xs text-charcoal/65 max-w-md mx-auto mb-5 leading-relaxed">
              We couldn&apos;t find any pieces matching your filter. Try adjusting your search query or medium filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn-primary py-2 px-5 text-xs font-bold tracking-wider uppercase shadow-[2px_2px_0px_0px_rgba(45,45,45,1)] cursor-pointer"
            >
              Show All Works
            </button>
          </div>
        )}

        {/* Studio Commission CTA Strip */}
        <div className="mt-16 p-6 sm:p-8 bg-[#18100C] text-linen border-1.5 border-charcoal shadow-[6px_6px_0px_0px_#c17b5c]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-terra mb-1.5">
                <Sparkles size={11} />
                <span>Bespoke Studio Commissions</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-linen">
                Have a unique vision for your home or wedding?
              </h3>
              <p className="text-xs text-linen/70 max-w-xl mt-1.5 leading-relaxed">
                Whether you need a custom bridal Varmala resin block, an intimate family charcoal portrait, or a cafe wall mural, Anki Matolia creates custom commissions from Studio Vinyas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                href="/commission"
                className="btn-primary py-2.5 px-5 text-xs font-bold tracking-wider uppercase text-center whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(237,229,216,1)]"
              >
                Submit Custom Brief →
              </Link>
              <Link
                href="/portfolio"
                className="btn-outline border-linen/30 text-linen hover:border-linen py-2.5 px-5 text-xs font-bold tracking-wider uppercase text-center whitespace-nowrap"
              >
                3D Corridor Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
