import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GALLERY_3D_ARTWORKS } from "@/data/artworks";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { inGallery: true },
      orderBy: { galleryOrder: "asc" },
      take: 8,
    });

    if (!products || products.length === 0) {
      return NextResponse.json({ artworks: GALLERY_3D_ARTWORKS });
    }

    const artworks = products.map((p, index) => {
      // Find matching metadata from curated catalog if available (for rich medium/size details)
      const fallback = GALLERY_3D_ARTWORKS.find(
        (g) => g.title.toLowerCase() === p.title.toLowerCase()
      ) || GALLERY_3D_ARTWORKS[index % GALLERY_3D_ARTWORKS.length];

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        subcategory: fallback?.subcategory || "Studio Original",
        description: p.description,
        price: p.price,
        priceFormatted: `₹${p.price.toLocaleString("en-IN")}`,
        tag: fallback?.tag || `${p.category} Piece`,
        image: p.images[0] || fallback?.image || "/artworks/vinyas-art-053.jpg",
        medium: fallback?.medium || "Original Mixed Media Artwork",
        size: fallback?.size || "Studio Standard",
        year: fallback?.year || "2025",
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
