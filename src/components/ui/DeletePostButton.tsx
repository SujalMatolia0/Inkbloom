"use client";

import { Trash2 } from "lucide-react";
import { deletePost } from "@/app/admin/posts/actions";

export function DeletePostButton({ postId }: { postId: string }) {
  const handleDelete = async (e: React.MouseEvent) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      e.preventDefault();
      return;
    }
    // The form action will handle the actual deletion if it's a submit button,
    // but here we are using a client-side click handler to confirm.
  };

  return (
    <form action={deletePost.bind(null, postId)}>
      <button
        type="submit"
        className="w-9 h-9 border border-red-500/20 flex items-center justify-center hover:bg-red-500/10 transition-colors"
        onClick={handleDelete}
      >
        <Trash2 size={14} className="text-red-400" />
      </button>
    </form>
  );
}
