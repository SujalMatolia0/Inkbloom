import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GALLERY_3D_ARTWORKS } from "@/data/artworks";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    let products = await prisma.product.findMany({
      where: { inGallery: true },
      orderBy: { galleryOrder: "asc" },
      take: 8,
    });

    // If no products are explicitly pinned to 3D gallery slots yet,
    // show the latest products from the store instead of old demo artworks.
    if (!products || products.length === 0) {
      products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      });
    }

    if (!products || products.length === 0) {
      return NextResponse.json({ artworks: GALLERY_3D_ARTWORKS });
    }

    const artworks = products.map((p, index) => {
      const matchedCatalog = GALLERY_3D_ARTWORKS.find(
        (g) => g.title.toLowerCase().trim() === p.title.toLowerCase().trim()
      );

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        subcategory: matchedCatalog?.subcategory || p.category || "Studio Original",
        description: p.description,
        price: p.price,
        priceFormatted: `₹${p.price.toLocaleString("en-IN")}`,
        tag: matchedCatalog?.tag || `${p.category} Piece`,
        image: p.images[0] || matchedCatalog?.image || "/artworks/vinyas-art-053.jpg",
        images: p.images,
        medium: matchedCatalog?.medium || `${p.category} · Handcrafted Original`,
        size: matchedCatalog?.size || "Studio Standard",
        year: matchedCatalog?.year || String(new Date(p.createdAt).getFullYear()),
        isCommissionOnly: p.stock === 0 || p.category === "Wall Art",
        featuredIn3D: true,
        galleryOrder: p.galleryOrder ?? index,
      };
    });

    return NextResponse.json({ artworks });
  } catch (error) {
    console.error("Failed to fetch gallery artworks:", error);
    return NextResponse.json({ artworks: GALLERY_3D_ARTWORKS });
  }
}
