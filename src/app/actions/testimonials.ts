"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTestimonials(onlyFeatured = false) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: onlyFeatured ? { isFeatured: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: testimonials };
  } catch (error: any) {
    console.error("Error fetching Testimonials:", error);
    return { success: false, error: error.message || "Failed to fetch Testimonials", data: [] };
  }
}

export async function createTestimonial(data: {
  clientName: string;
  clientRole?: string;
  content: string;
  artworkTitle?: string;
  rating?: number;
  image?: string;
  isFeatured?: boolean;
  order?: number;
}) {
  try {
    const newTestimonial = await prisma.testimonial.create({
      data: {
        clientName: data.clientName.trim(),
        clientRole: data.clientRole?.trim() || "",
        content: data.content.trim(),
        artworkTitle: data.artworkTitle?.trim() || "",
        rating: data.rating ?? 5,
        image: data.image || null,
        isFeatured: data.isFeatured ?? true,
        order: data.order ?? 0,
      },
    });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/testimonials");
    return { success: true, data: newTestimonial };
  } catch (error: any) {
    console.error("Error creating Testimonial:", error);
    return { success: false, error: error.message || "Failed to create Testimonial" };
  }
}

export async function updateTestimonial(
  id: string,
  data: {
    clientName?: string;
    clientRole?: string;
    content?: string;
    artworkTitle?: string;
    rating?: number;
    image?: string;
    isFeatured?: boolean;
    order?: number;
  }
) {
  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/testimonials");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating Testimonial:", error);
    return { success: false, error: error.message || "Failed to update Testimonial" };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting Testimonial:", error);
    return { success: false, error: error.message || "Failed to delete Testimonial" };
  }
}
