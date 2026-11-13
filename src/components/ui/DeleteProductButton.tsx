"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProduct } from "@/app/admin/products/actions";
import { toast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this artwork? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteProduct(productId);
      if (result.ok) {
        toast.success("Artwork Deleted", result.message);
        router.refresh();
      } else {
        toast.error("Delete Failed", result.error);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      title="Delete Artwork"
      className="w-8 h-8 border border-red-500/20 flex items-center justify-center hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <Loader2 size={13} className="text-red-400 animate-spin" />
      ) : (
        <Trash2 size={13} className="text-red-400" />
      )}
    </button>
  );
}
