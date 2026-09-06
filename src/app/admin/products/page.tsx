import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra-pale text-[9.5px] font-bold tracking-widest uppercase mb-3">
          <span>✦</span>
          <span>Studio Vinyas · Artworks Inventory</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-linen">
          Catalog &amp; Artworks
        </h1>
        <p className="text-xs text-linen/50 mt-1 max-w-lg">
          Manage original sketches, canvas paintings, temple/cafe murals, and handmade craft keepsakes from Anki Matolia&apos;s studio.
        </p>
      </div>

      <AdminProductsManager initialProducts={products} />
    </div>
  );
}
