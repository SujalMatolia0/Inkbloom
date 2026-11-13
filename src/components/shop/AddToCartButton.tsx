"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Check, ArrowRight, MessageSquarePlus } from "lucide-react";
import { ArtworkCustomizerModal } from "./ArtworkCustomizerModal";
import { toast } from "@/components/ui/Toast";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
  stock?: number;
  subcategory?: string;
  medium?: string;
}

export function AddToCartButton({
  product,
  isSold,
  hideAddToCart = false,
}: {
  product: Product;
  isSold: boolean;
  /** When true, only show the Personalize/Customize button (the Add to Cart row is handled by ProductAddOns) */
  hideAddToCart?: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [orderNote, setOrderNote] = useState("");

  const isMural = product.category === "Wall Art";

  const handleAddToCart = () => {
    const trimmedNote = orderNote.trim();
    const cartId = trimmedNote ? `${product.id}__note-${Date.now()}` : product.id;

    addItem({
      id: cartId,
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      slug: product.slug,
      ...(trimmedNote
        ? { customization: { categoryType: product.category, instructions: trimmedNote } }
        : {}),
    });
    setIsAdded(true);
    toast.success("Added to Cart!", `${product.title} — ₹${product.price.toLocaleString("en-IN")}`);
    setTimeout(() => {
      router.push("/cart");
    }, 600);
  };

  return (
    <>
      <div className="flex flex-col gap-2.5 w-full">
        {/* If it's a Mural */}
        {isMural ? (
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="btn-primary py-3.5 px-6 text-xs font-bold tracking-wider uppercase text-center flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(45,45,45,1)]"
          >
            <span>Commission This Wall Mural</span>
            <ArrowRight size={14} />
          </button>
        ) : (
          <>
            {!isSold && !hideAddToCart && (
              <>
                {/* Optional Comment / Expectations box even when no add-ons were configured */}
                <div className="border border-charcoal/20 bg-white/70 p-3">
                  <button
                    type="button"
                    onClick={() => setShowNoteBox((v) => !v)}
                    className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-charcoal/80 hover:text-terra transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquarePlus size={13} className="text-terra" />
                      <span>Add Comment / Expectations (Optional)</span>
                    </span>
                    <span className="text-[10px] font-mono text-charcoal/50">
                      {showNoteBox ? "Hide" : "Write Note"}
                    </span>
                  </button>

                  {showNoteBox && (
                    <textarea
                      rows={2}
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="Share preferred colors, design tweaks, gift message, or what you expect..."
                      className="mt-2.5 w-full px-3 py-2 bg-white border border-charcoal/25 text-xs font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-terra"
                    />
                  )}
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-add-cart w-full flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold tracking-wider uppercase shadow-[3px_3px_0px_0px_rgba(45,45,45,1)]"
                >
                  {isAdded ? (
                    <>
                      <Check size={14} />
                      <span>Added to Cart — Redirecting...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Add to Cart — ₹{product.price.toLocaleString("en-IN")}</span>
                    </>
                  )}
                </button>
              </>
            )}

            {/* Customizer Option with Reference Image Upload */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="btn-outline w-full py-3 px-6 text-xs font-bold tracking-wider uppercase text-center flex items-center justify-center gap-2"
            >
              <Sparkles size={13} className="text-terra" />
              <span>
                {isSold
                  ? "Customize & Order Made-to-Order Piece"
                  : "Personalize / Add Reference Photo"}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Modal */}
      <ArtworkCustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        product={{
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          slug: product.slug,
          category: product.category || "Original",
          stock: product.stock ?? (isSold ? 0 : 1),
          subcategory: product.subcategory,
          medium: product.medium,
        }}
      />
    </>
  );
}
