"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  ExternalLink, 
  Search, 
  Check, 
  Eye, 
  Layers,
  ArrowRight
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  inGallery: boolean;
  galleryOrder: number | null;
}

interface AdminGalleryManagerProps {
  initialGallery: Product[];
  initialAllArtworks: Product[];
}

const CORRIDOR_SLOT_META = [
  { slot: 1, wall: "Left Wall", note: "Corridor Entrance" },
  { slot: 2, wall: "Right Wall", note: "Early Walkway" },
  { slot: 3, wall: "Left Wall", note: "Mid Corridor" },
  { slot: 4, wall: "Right Wall", note: "Mid Corridor" },
  { slot: 5, wall: "Left Wall", note: "Deep Corridor" },
  { slot: 6, wall: "Right Wall", note: "Deep Corridor" },
  { slot: 7, wall: "Left Wall", note: "Atelier Approach" },
  { slot: 8, wall: "Right Wall", note: "Adjacent to Studio Door" },
];

export function AdminGalleryManager({
  initialGallery,
  initialAllArtworks,
}: AdminGalleryManagerProps) {
  const [gallery, setGallery] = useState<Product[]>(initialGallery);
  const [allArtworks, setAllArtworks] = useState<Product[]>(initialAllArtworks);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Categories list
  const categories = ["All", "Sketch", "Canvas", "Wall Art", "Craft"];

  // Filter catalog artworks
  const filteredCatalog = allArtworks.filter((art) => {
    const matchesCategory = selectedCategory === "All" || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.description.toLowerCase().includes(search.toLowerCase()) ||
      art.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Reorder Gallery Slots (Move Up)
  const handleMoveUp = async (index: number) => {
    if (index <= 0 || isUpdating) return;
    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[index - 1];
    newGallery[index - 1] = temp;

    // Optimistic update
    setGallery(newGallery);
    await syncReorderedSlots(newGallery);
  };

  // Reorder Gallery Slots (Move Down)
  const handleMoveDown = async (index: number) => {
    if (index >= gallery.length - 1 || isUpdating) return;
    const newGallery = [...gallery];
    const temp = newGallery[index];
    newGallery[index] = newGallery[index + 1];
    newGallery[index + 1] = temp;

    // Optimistic update
    setGallery(newGallery);
    await syncReorderedSlots(newGallery);
  };

  // Sync reordered slots to server
  const syncReorderedSlots = async (orderedList: Product[]) => {
    setIsUpdating(true);
    setStatusMessage(null);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderedArtworkIds: orderedList.map((item) => item.id),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to sync reordered gallery.");
      }

      setStatusMessage({ text: "Gallery slot order saved successfully.", isError: false });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: "Error saving slot order. Please try again.", isError: true });
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove artwork from gallery
  const handleRemoveFromGallery = async (artworkId: string, title: string) => {
    if (!confirm(`Remove "${title}" from the 3D gallery corridor?`)) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/gallery?artworkId=${artworkId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const updatedGallery = gallery.filter((item) => item.id !== artworkId);
        setGallery(updatedGallery);
        setAllArtworks((prev) =>
          prev.map((a) => (a.id === artworkId ? { ...a, inGallery: false, galleryOrder: 0 } : a))
        );
        setStatusMessage({ text: `Removed "${title}" from gallery corridor.`, isError: false });
        setTimeout(() => setStatusMessage(null), 3000);
      } else {
        alert("Failed to remove artwork from gallery.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing artwork.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Add artwork to gallery (into specific slot or next available)
  const handleAddToGallery = async (artworkId: string, targetSlot?: number) => {
    if (gallery.length >= 8 && typeof targetSlot !== "number") {
      alert("All 8 corridor slots are currently occupied. Please replace an existing slot or remove one first.");
      return;
    }

    setIsUpdating(true);
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          targetSlot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to add artwork to gallery.");
      } else {
        // Refetch or update state
        const targetArt = allArtworks.find((a) => a.id === artworkId);
        if (targetArt) {
          const updatedArt = { ...targetArt, inGallery: true, galleryOrder: data.artwork.galleryOrder };
          let newGallery: Product[];
          if (typeof targetSlot === "number") {
            newGallery = gallery.filter((g) => g.galleryOrder !== targetSlot);
            newGallery.push(updatedArt);
            newGallery.sort((a, b) => (a.galleryOrder ?? 0) - (b.galleryOrder ?? 0));
          } else {
            newGallery = [...gallery, updatedArt].sort((a, b) => (a.galleryOrder ?? 0) - (b.galleryOrder ?? 0));
          }
          setGallery(newGallery);
          setAllArtworks((prev) =>
            prev.map((a) => (a.id === artworkId ? updatedArt : a))
          );
        }
        setStatusMessage({ text: `Added to 3D gallery corridor.`, isError: false });
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err) {
      console.error(err);
      alert("Error adding artwork to gallery.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-6 bg-linen/[0.04] border border-linen/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-terra/20 border border-terra/50 text-terra-pale text-[10px] font-bold tracking-wider uppercase">
              ✦ 8 Architectural Wall Slots
            </span>
            <span className="text-[11px] font-mono text-linen/60">
              {gallery.length} of 8 Slots Occupied
            </span>
          </div>
          <p className="text-xs text-linen/70 max-w-xl font-sans pt-1">
            Artworks configured below will physically hang in alternating sequence (Left Wall &amp; Right Wall) along the 32-meter 3D corridor leading to the studio atelier.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <Link
            href="/portfolio"
            target="_blank"
            className="inline-flex items-center gap-2 bg-terra hover:bg-terra-dark text-linen text-xs font-bold uppercase tracking-wider py-2.5 px-4 border border-terra transition-all shadow-[2px_2px_0_rgba(0,0,0,0.6)] hover:translate-x-[-1px] hover:translate-y-[-1px]"
          >
            <Eye size={14} />
            <span>Walkthrough 3D Gallery</span>
            <ExternalLink size={12} className="opacity-60" />
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 text-xs flex items-center gap-2 border ${
            statusMessage.isError
              ? "bg-red-950/40 border-red-500/50 text-red-300"
              : "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
          }`}
        >
          <Check size={14} />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Corridor Visual Slots Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-terra" />
            <h2 className="font-serif text-xl font-bold text-linen">
              Curated Corridor Sequence (Slots 1 to 8)
            </h2>
          </div>
          <span className="text-[10px] text-linen/40 font-mono">
            {isUpdating ? "Saving changes..." : "Use arrows to reorder slots"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CORRIDOR_SLOT_META.map((meta, index) => {
            const artwork = gallery[index];

            return (
              <div
                key={`slot-${meta.slot}`}
                className={`p-4 border transition-all flex flex-col justify-between ${
                  artwork
                    ? "bg-[#1C1410] border-terra/40 shadow-[4px_4px_0_rgba(0,0,0,0.5)]"
                    : "bg-linen/[0.02] border-dashed border-linen/20 hover:border-linen/40"
                }`}
              >
                {/* Slot Header */}
                <div className="flex items-center justify-between pb-3 border-b border-linen/10 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-terra-pale bg-terra/20 px-2 py-0.5 border border-terra/40">
                      Slot {meta.slot}
                    </span>
                    <span className="text-[9.5px] uppercase font-bold tracking-wider text-linen/70">
                      {meta.wall}
                    </span>
                  </div>
                  <span className="text-[9px] text-linen/40 font-sans">
                    {meta.note}
                  </span>
                </div>

                {/* Artwork Content */}
                {artwork ? (
                  <div>
                    <div className="relative w-full aspect-[4/5] bg-charcoal/30 border border-linen/20 mb-3 overflow-hidden group">
                      <Image
                        src={artwork.images[0] || "/artworks/vinyas-art-053.jpg"}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[9px] font-bold text-linen uppercase tracking-wider">
                        {artwork.category}
                      </div>
                    </div>

                    <h3 className="font-serif font-bold text-sm text-linen line-clamp-1">
                      {artwork.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs mt-1">
                      <span className="font-bold text-terra-pale">
                        ₹{artwork.price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] text-linen/50 uppercase">
                        {artwork.stock === 0 ? "Bespoke Only" : "Available"}
                      </span>
                    </div>

                    {/* Slot Controls */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-linen/10">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0 || isUpdating}
                          title="Move to earlier slot"
                          className="p-1.5 bg-linen/10 hover:bg-terra text-linen/70 hover:text-linen border border-linen/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index >= gallery.length - 1 || isUpdating}
                          title="Move to later slot"
                          className="p-1.5 bg-linen/10 hover:bg-terra text-linen/70 hover:text-linen border border-linen/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveFromGallery(artwork.id, artwork.title)}
                        disabled={isUpdating}
                        title="Remove from 3D Gallery"
                        className="p-1.5 text-linen/40 hover:text-red-400 hover:bg-red-950/40 border border-transparent hover:border-red-500/30 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-10 h-10 border border-dashed border-linen/30 flex items-center justify-center text-linen/40 mb-2">
                      <Plus size={16} />
                    </div>
                    <span className="text-xs font-serif text-linen/60">Empty Wall Space</span>
                    <p className="text-[10px] text-linen/40 mt-1 max-w-[150px]">
                      Choose an artwork from the catalog below to hang on this slot.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Catalog Selector Section */}
      <div className="pt-6 border-t border-linen/15">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-linen flex items-center gap-2">
              <Sparkles size={16} className="text-terra-pale" />
              <span>Studio Catalog Artworks</span>
            </h2>
            <p className="text-xs text-linen/50 mt-0.5">
              Select artworks to display in empty slots or replace existing exhibits.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen/40" />
            <input
              type="text"
              placeholder="Search studio catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra placeholder:text-linen/30"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider border transition-colors ${
                selectedCategory === cat
                  ? "bg-terra text-linen border-terra"
                  : "bg-transparent text-linen/60 border-linen/20 hover:text-linen hover:border-linen/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Artworks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCatalog.map((art) => {
            const inGalleryItem = gallery.find((g) => g.id === art.id);
            const slotIndex = inGalleryItem ? gallery.indexOf(inGalleryItem) + 1 : null;

            return (
              <div
                key={art.id}
                className="p-3.5 bg-linen/[0.03] border border-linen/15 hover:border-linen/35 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-[4/5] bg-charcoal/20 border border-linen/10 overflow-hidden mb-3 group">
                    <Image
                      src={art.images[0] || "/artworks/vinyas-art-053.jpg"}
                      alt={art.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 text-[9px] font-bold text-linen uppercase">
                      {art.category}
                    </div>
                  </div>

                  <h4 className="font-serif font-bold text-xs text-linen line-clamp-1">
                    {art.title}
                  </h4>
                  <div className="font-bold text-terra-pale text-xs mt-1">
                    ₹{art.price.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[10px] text-linen/50 line-clamp-2 mt-1 font-sans">
                    {art.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-linen/10">
                  {inGalleryItem ? (
                    <div className="w-full text-center py-1.5 px-2 bg-terra/20 border border-terra/60 text-terra-pale text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
                      <Check size={12} />
                      <span>In Gallery (Slot {slotIndex})</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToGallery(art.id)}
                      disabled={isUpdating}
                      className="w-full py-1.5 px-3 bg-linen/10 hover:bg-terra text-linen text-[10px] font-bold uppercase tracking-wider border border-linen/20 hover:border-terra transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Plus size={12} />
                      <span>Add to 3D Gallery</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
