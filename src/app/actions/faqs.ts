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

export async function getFaqs(onlyPublished = true) {
  try {
    const faqs = await prisma.faq.findMany({
      where: onlyPublished ? { isPublished: true } : undefined,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: faqs };
  } catch (error: unknown) {
    console.error("Error fetching FAQs:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch FAQs";
    return { success: false, error: message, data: [] };
  }
}

export async function createFaq(data: {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isPublished?: boolean;
}) {
  await requireAdmin();
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
  } catch (error: unknown) {
    console.error("Error creating FAQ:", error);
    const message = error instanceof Error ? error.message : "Failed to create FAQ";
    return { success: false, error: message };
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
  await requireAdmin();
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
  } catch (error: unknown) {
    console.error("Error updating FAQ:", error);
    const message = error instanceof Error ? error.message : "Failed to update FAQ";
    return { success: false, error: message };
  }
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  try {
    await prisma.faq.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/commission");
    revalidatePath("/admin/faqs");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting FAQ:", error);
    const message = error instanceof Error ? error.message : "Failed to delete FAQ";
    return { success: false, error: message };
  }
}
