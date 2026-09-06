"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getFaqs(onlyPublished = true) {
  try {
    const faqs = await prisma.faq.findMany({
      where: onlyPublished ? { isPublished: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: faqs };
  } catch (error: any) {
    console.error("Error fetching FAQs:", error);
    return { success: false, error: error.message || "Failed to fetch FAQs", data: [] };
  }
}

export async function createFaq(data: {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isPublished?: boolean;
}) {
  try {
    const newFaq = await prisma.faq.create({
      data: {
        question: data.question.trim(),
        answer: data.answer.trim(),
        category: data.category?.trim() || "General",
        order: data.order ?? 0,
        isPublished: data.isPublished ?? true,
      },
    });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/faqs");
    return { success: true, data: newFaq };
  } catch (error: any) {
    console.error("Error creating FAQ:", error);
    return { success: false, error: error.message || "Failed to create FAQ" };
  }
}

export async function updateFaq(
  id: string,
  data: {
    question?: string;
    answer?: string;
    category?: string;
    order?: number;
    isPublished?: boolean;
  }
) {
  try {
    const updated = await prisma.faq.update({
      where: { id },
      data,
    });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/faqs");
    return { success: true, data: updated };
  } catch (error: any) {
    console.error("Error updating FAQ:", error);
    return { success: false, error: error.message || "Failed to update FAQ" };
  }
}

export async function deleteFaq(id: string) {
  try {
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting FAQ:", error);
    return { success: false, error: error.message || "Failed to delete FAQ" };
  }
}
