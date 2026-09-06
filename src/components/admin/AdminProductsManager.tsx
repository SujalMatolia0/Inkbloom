"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Plus, 
  Pencil, 
  Search, 
  X, 
  ExternalLink, 
  Package, 
  Sparkles, 
  SlidersHorizontal,
  Palette,
  CheckCircle2,
  Clock
} from "lucide-react";
import { DeleteProductButton } from "@/components/ui/DeleteProductButton";
import { cn } from "@/theme/components";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  createdAt: string | Date;
}

const CATEGORIES = [
  { id: "all", label: "All Works" },
  { id: "Sketch", label: "Sketch & Portraits" },
  { id: "Canvas", label: "Canvas Paintings" },
  { id: "Wall Art", label: "Wall Art & Murals" },
  { id: "Craft", label: "Craft & Keepsakes" },
];

export function AdminProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "bespoke">("all");
  const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "title">("newest");

  // Metrics
  const totalArtworks = initialProducts.length;
  const readyToShipCount = initialProducts.filter((p) => p.stock > 0 && p.category !== "Wall Art").length;
  const bespokeCount = initialProducts.filter((p) => p.stock === 0 || p.category === "Wall Art").length;
  const totalValue = initialProducts.reduce((sum, p) => sum + p.price, 0);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProducts.length };
    for (const p of initialProducts) {
      counts[p.category] = (counts[p.category] || 0) + 1;
    }
    return counts;
  }, [initialProducts]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Category
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }

      // Stock
      if (stockFilter === "in-stock" && (product.stock <= 0 || product.category === "Wall Art")) {
        return false;
      }
      if (stockFilter === "bespoke" && product.stock > 0 && product.category !== "Wall Art") {
        return false;
      }

      // Search
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesId = product.id.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesDesc && !matchesId) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [initialProducts, selectedCategory, stockFilter, searchQuery, sortBy]);

  return (
    <div className="space-y-6">
      {/* Studio Metrics Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-deep2 border border-charcoal/40 p-5 shadow-neo-ch relative overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-linen/40 mb-1">
            Total Artworks
          </div>
          <div className="font-serif text-3xl font-bold text-linen">
            {totalArtworks}
          </div>
          <div className="text-[9.5px] text-linen/50 mt-1 font-mono">
            In Studio Vinyas Catalog
          </div>
        </div>

        <div className="bg-deep2 border border-charcoal/40 p-5 shadow-neo-ch relative overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-moss mb-1">
            Ready to Ship
          </div>
          <div className="font-serif text-3xl font-bold text-moss">
            {readyToShipCount}
          </div>
          <div className="text-[9.5px] text-linen/50 mt-1 font-mono">
            Available in Studio Inventory
          </div>
        </div>

        <div className="bg-deep2 border border-charcoal/40 p-5 shadow-neo-ch relative overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-terra mb-1">
            Bespoke &amp; Murals
          </div>
          <div className="font-serif text-3xl font-bold text-terra">
            {bespokeCount}
          </div>
          <div className="text-[9.5px] text-linen/50 mt-1 font-mono">
            Made to Order / Wall Commissions
          </div>
        </div>

        <div className="bg-deep2 border border-charcoal/40 p-5 shadow-neo-ch relative overflow-hidden">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-linen/40 mb-1">
            Catalog Value
          </div>
          <div className="font-serif text-3xl font-bold text-terra-pale">
            ₹{totalValue.toLocaleString("en-IN")}
          </div>
          <div className="text-[9.5px] text-linen/50 mt-1 font-mono">
            Average: ₹{Math.round(totalValue / (totalArtworks || 1)).toLocaleString("en-IN")}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-deep2 border border-charcoal/40 p-4 shadow-neo-ch space-y-4">
        {/* Category Filter Pills (No Emojis) */}
        <div className="flex items-center gap-2 overflow-x-auto flex-nowrap pb-1 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 text-[10.5px] font-bold tracking-wider uppercase whitespace-nowrap transition-all border",
                  isActive
                    ? "bg-terra border-terra text-linen shadow-sm"
                    : "bg-deep/80 border-charcoal/40 text-linen/60 hover:text-linen hover:border-linen/30 hover:bg-deep"
                )}
              >
                {isActive && <span className="text-[9px] text-linen">✦</span>}
                <span>{cat.label}</span>
                <span className={cn(
                  "text-[9px] px-1.5 py-0.2 rounded font-mono font-bold",
                  isActive ? "bg-linen/25 text-linen" : "bg-linen/10 text-linen/60"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Row: Search, Stock Filter, Sort, and Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-charcoal/40">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artworks by title, category, ID..."
              className="w-full pl-8 pr-8 py-2 bg-deep border border-charcoal/60 text-xs text-linen placeholder:text-linen/30 font-sans focus:outline-none focus:border-terra transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-linen/40 hover:text-linen"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Stock Filter Toggle */}
            <div className="flex items-center border border-charcoal/60 bg-deep p-0.5 text-[9.5px] font-bold uppercase tracking-wider">
              <button
                onClick={() => setStockFilter("all")}
                className={cn(
                  "px-2.5 py-1.5 transition-all",
                  stockFilter === "all" ? "bg-terra text-linen" : "text-linen/50 hover:text-linen"
                )}
              >
                All
              </button>
              <button
                onClick={() => setStockFilter("in-stock")}
                className={cn(
                  "px-2.5 py-1.5 transition-all",
                  stockFilter === "in-stock" ? "bg-terra text-linen" : "text-linen/50 hover:text-linen"
                )}
              >
                In Studio
              </button>
              <button
                onClick={() => setStockFilter("bespoke")}
                className={cn(
                  "px-2.5 py-1.5 transition-all",
                  stockFilter === "bespoke" ? "bg-terra text-linen" : "text-linen/50 hover:text-linen"
                )}
              >
                Made to Order
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 border border-charcoal/60 bg-deep px-3 py-1.5 text-xs text-linen">
              <SlidersHorizontal size={12} className="text-linen/40" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none outline-none font-sans text-[10.5px] font-bold tracking-wider uppercase text-linen cursor-pointer"
              >
                <option value="newest" className="bg-deep2 text-linen">Newest First</option>
                <option value="price-asc" className="bg-deep2 text-linen">Price: Low to High</option>
                <option value="price-desc" className="bg-deep2 text-linen">Price: High to Low</option>
                <option value="title" className="bg-deep2 text-linen">Title: A to Z</option>
              </select>
            </div>

            {/* Add Artwork Button */}
            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-terra hover:bg-terra-dark text-linen text-[10.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]"
            >
              <Plus size={14} />
              <span>Add Piece</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Artworks Table */}
      <div className="bg-deep2 border border-charcoal/40 shadow-neo-ch overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-linen/5 flex items-center justify-center mx-auto mb-4">
              <Package size={28} className="text-linen/30" />
            </div>
            <h3 className="font-serif text-lg font-bold text-linen mb-1">No Artworks Found</h3>
            <p className="text-xs text-linen/40 max-w-md mx-auto mb-4">
              No pieces match your current search or filter criteria. Try clearing the filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setStockFilter("all");
              }}
              className="px-4 py-2 border border-terra text-terra font-bold text-[10px] uppercase tracking-wider hover:bg-terra hover:text-linen transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-charcoal/40 bg-linen/[0.02]">
                  <th className="text-left text-[9.5px] font-bold uppercase tracking-[0.2em] text-linen/40 p-4 sm:p-5">
                    Artwork
                  </th>
                  <th className="text-left text-[9.5px] font-bold uppercase tracking-[0.2em] text-linen/40 p-4 sm:p-5">
                    Category
                  </th>
                  <th className="text-left text-[9.5px] font-bold uppercase tracking-[0.2em] text-linen/40 p-4 sm:p-5">
                    Price (INR)
                  </th>
                  <th className="text-left text-[9.5px] font-bold uppercase tracking-[0.2em] text-linen/40 p-4 sm:p-5">
                    Inventory Status
                  </th>
                  <th className="text-right text-[9.5px] font-bold uppercase tracking-[0.2em] text-linen/40 p-4 sm:p-5">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/40">
                {filteredProducts.map((product) => {
                  const isMural = product.category === "Wall Art";
                  const isAvailable = product.stock > 0 && !isMural;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-linen/[0.02] transition-colors group"
                    >
                      {/* Artwork Info & Thumbnail */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-16 bg-deep border border-charcoal/60 relative overflow-hidden flex-shrink-0 group-hover:border-terra transition-colors">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-linen/20">
                                <Palette size={18} />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-[13.5px] font-bold text-linen group-hover:text-terra-pale transition-colors line-clamp-1">
                                {product.title}
                              </p>
                              <Link
                                href={`/shop/${product.slug}`}
                                target="_blank"
                                title="View in live shop"
                                className="text-linen/30 hover:text-terra transition-colors"
                              >
                                <ExternalLink size={12} />
                              </Link>
                            </div>
                            <p className="text-[10px] text-linen/40 font-mono mt-0.5">
                              /{product.slug} · ID: {product.id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="p-4 sm:p-5">
                        <span className={cn(
                          "text-[9.5px] font-bold px-2.5 py-1 border uppercase tracking-wider",
                          product.category === "Sketch" && "border-blue-500/30 text-blue-300/80 bg-blue-500/10",
                          product.category === "Canvas" && "border-terra/40 text-terra-pale bg-terra/10",
                          product.category === "Wall Art" && "border-amber-500/40 text-amber-300/80 bg-amber-500/10",
                          product.category === "Craft" && "border-emerald-500/40 text-emerald-300/80 bg-emerald-500/10"
                        )}>
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="p-4 sm:p-5">
                        <span className="font-serif text-[15px] font-bold text-terra">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            isAvailable ? "bg-moss animate-pulse" : isMural ? "bg-amber-400" : "bg-blush"
                          )}></div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.12em]",
                            isAvailable ? "text-moss" : isMural ? "text-amber-300/90" : "text-blush"
                          )}>
                            {isAvailable ? `In Studio (${product.stock})` : isMural ? "Bespoke Mural" : "Made to Order"}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/shop/${product.slug}`}
                            target="_blank"
                            title="Preview in Store"
                            className="w-8 h-8 border border-charcoal/60 flex items-center justify-center text-linen/40 hover:text-terra hover:border-terra transition-all"
                          >
                            <ExternalLink size={13} />
                          </Link>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            title="Edit Artwork"
                            className="w-8 h-8 border border-charcoal/60 flex items-center justify-center text-linen/40 hover:text-terra hover:border-terra transition-all"
                          >
                            <Pencil size={13} />
                          </Link>
                          <DeleteProductButton productId={product.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
