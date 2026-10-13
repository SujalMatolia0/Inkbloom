"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "ADMIN") throw new Error("Not authorized");
  return user;
}

export async function getTestimonials(onlyFeatured = false) {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: onlyFeatured ? { isFeatured: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: testimonials };
  } catch (error: unknown) {
    console.error("Error fetching Testimonials:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch Testimonials";
    return { success: false, error: message, data: [] };
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
  await requireAdmin();
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
  } catch (error: unknown) {
    console.error("Error creating Testimonial:", error);
    const message = error instanceof Error ? error.message : "Failed to create Testimonial";
    return { success: false, error: message };
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
  await requireAdmin();
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
  } catch (error: unknown) {
    console.error("Error updating Testimonial:", error);
    const message = error instanceof Error ? error.message : "Failed to update Testimonial";
    return { success: false, error: message };
  }
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  try {
    await prisma.testimonial.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/testimonials");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting Testimonial:", error);
    const message = error instanceof Error ? error.message : "Failed to delete Testimonial";
    return { success: false, error: message };
  }
}
