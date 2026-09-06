import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createProduct } from "../actions";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="p-8 max-w-[850px]">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra-pale text-[9.5px] font-bold tracking-widest uppercase mb-3">
          <span>✦</span>
          <span>Studio Vinyas · New Artwork</span>
        </div>
        <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
          New Artwork
        </h1>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
          Upload artwork with Cloudinary media hosting & publish to catalog
        </p>
      </div>

      <AdminProductForm action={createProduct} />
    </div>
  );
}
