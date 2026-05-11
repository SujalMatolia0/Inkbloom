"use client";

import { useCartStore } from "@/lib/store/cart";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
}

export function AddToCartButton({ product, isSold }: { product: Product; isSold: boolean }) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  if (isSold) {
    return (
      <button 
        disabled
        className="btn-outline w-full opacity-50 cursor-not-allowed"
      >
        Sold Out
      </button>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
    router.push('/cart');
  };

  return (
    <button
      onClick={handleAddToCart}
      className="btn-add-cart"
    >
      <Plus size={14} />
      Add to Cart — ₹{product.price.toLocaleString("en-IN")}
    </button>
  );
}
