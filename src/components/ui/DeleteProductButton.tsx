"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/products/actions";

export function DeleteProductButton({ productId }: { productId: string }) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    await deleteProduct(productId);
  };

  return (
    <button
      onClick={handleDelete}
      className="w-9 h-9 border border-red-500/20 flex items-center justify-center hover:bg-red-500/10 transition-colors"
    >
      <Trash2 size={14} className="text-red-400" />
    </button>
  );
}
