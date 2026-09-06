import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

    return NextResponse.json({
      galleryArtworks,
      allArtworks: allProducts,
    });
  } catch (error) {
    console.error("Admin gallery fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery data" }, { status: 500 });
  }
}

// POST: Add artwork to gallery or replace a slot
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { artworkId, targetSlot } = await req.json();

    if (!artworkId) {
      return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 });
    }

    // Check if targetSlot is provided (0 to 7)
    if (typeof targetSlot === "number" && targetSlot >= 0 && targetSlot < 8) {
      // If another artwork was occupying this slot, remove or swap it
      await prisma.product.updateMany({
        where: { inGallery: true, galleryOrder: targetSlot },
        data: { inGallery: false, galleryOrder: 0 },
      });

      // Update target artwork
      const updated = await prisma.product.update({
        where: { id: artworkId },
        data: { inGallery: true, galleryOrder: targetSlot },
      });

      return NextResponse.json({ success: true, artwork: updated });
    }

    // Otherwise, find the lowest unused slot (0..7)
    const currentInGallery = await prisma.product.findMany({
      where: { inGallery: true },
      select: { galleryOrder: true },
    });

    const usedSlots = new Set(currentInGallery.map((c) => c.galleryOrder ?? 0));
    let nextSlot = -1;
    for (let i = 0; i < 8; i++) {
      if (!usedSlots.has(i)) {
        nextSlot = i;
        break;
      }
    }

    if (nextSlot === -1) {
      return NextResponse.json(
        { error: "All 8 corridor slots are full. Please remove or swap an existing slot." },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id: artworkId },
      data: { inGallery: true, galleryOrder: nextSlot },
    });

    return NextResponse.json({ success: true, artwork: updated });
  } catch (error) {
    console.error("Admin add to gallery error:", error);
    return NextResponse.json({ error: "Failed to update gallery" }, { status: 500 });
  }
}

// PATCH: Bulk reorder corridor slots (accepts ordered array of artwork IDs)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderedArtworkIds } = await req.json();

    if (!Array.isArray(orderedArtworkIds)) {
      return NextResponse.json({ error: "Invalid orderedArtworkIds array" }, { status: 400 });
    }

    // Sequential updates to avoid connection pool transaction timeouts on Supabase
    for (let i = 0; i < Math.min(orderedArtworkIds.length, 8); i++) {
      await prisma.product.update({
        where: { id: orderedArtworkIds[i] },
        data: { inGallery: true, galleryOrder: i },
      });
    }

    const updatedGallery = await prisma.product.findMany({
      where: { inGallery: true },
      orderBy: { galleryOrder: "asc" },
    });

    return NextResponse.json({ success: true, galleryArtworks: updatedGallery });
  } catch (error) {
    console.error("Admin reorder gallery error:", error);
    return NextResponse.json({ error: "Failed to reorder gallery" }, { status: 500 });
  }
}

// DELETE: Remove artwork from gallery
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const artworkId = searchParams.get("artworkId");

    if (!artworkId) {
      return NextResponse.json({ error: "Artwork ID is required" }, { status: 400 });
    }

    await prisma.product.update({
      where: { id: artworkId },
      data: { inGallery: false, galleryOrder: 0 },
    });

    return NextResponse.json({ success: true, message: "Artwork removed from gallery" });
  } catch (error) {
    console.error("Admin remove from gallery error:", error);
    return NextResponse.json({ error: "Failed to remove artwork from gallery" }, { status: 500 });
  }
}
