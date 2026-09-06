"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, Check, ArrowRight } from "lucide-react";
import { ArtworkCustomizerModal } from "./ArtworkCustomizerModal";

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
}: {
  product: Product;
  isSold: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const isMural = product.category === "Wall Art";
  const isCustomizable =
    isMural ||
    product.category === "Sketch" ||
    product.category === "Craft" ||
    product.category === "Canvas" ||
    isSold;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      slug: product.slug,
    });
    setIsAdded(true);
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
            {!isSold && (
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
            )}

            {/* Customizer Option for all pieces */}
            <button
              onClick={() => setIsCustomizerOpen(true)}
              className="btn-outline w-full py-3 px-6 text-xs font-bold tracking-wider uppercase text-center flex items-center justify-center gap-2"
            >
              <Sparkles size={13} className="text-terra" />
              <span>
                {isSold
                  ? "Customize & Order Made-to-Order Piece"
                  : "Personalize / Add Custom Request"}
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
