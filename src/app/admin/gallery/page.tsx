import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminGalleryManager } from "@/components/admin/AdminGalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const [galleryArtworks, allProducts] = await Promise.all([
    prisma.product.findMany({
      where: { inGallery: true },
      orderBy: { galleryOrder: "asc" },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra-pale text-[9.5px] font-bold tracking-widest uppercase mb-3">
          <span>✦</span>
          <span>Studio Vinyas · 3D Virtual Corridor Exhibition</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-linen">
          3D Gallery Curation
        </h1>
        <p className="text-xs text-linen/50 mt-1 max-w-xl font-sans">
          Configure which 8 museum-grade artworks hang along the left and right walls of the virtual corridor in the 3D walkthrough experience.
        </p>
      </div>

      <AdminGalleryManager
        initialGallery={galleryArtworks}
        initialAllArtworks={allProducts}
      />
    </div>
  );
}
