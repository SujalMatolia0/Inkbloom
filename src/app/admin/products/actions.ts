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

/** Converts a title to a URL-safe slug */
function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Ensures slug is unique; appends -2, -3, … if taken (optionally excluding a product id) */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base;
  let counter = 1;
  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!existing) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function createProduct(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = (formData.get("title") as string)?.trim();
    const rawSlug = (formData.get("slug") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = (formData.get("category") as string)?.trim();
    const imagesText = formData.get("images") as string;
    const addOnsText = (formData.get("addOns") as string)?.trim() || "[]";

    if (!title) return { ok: false, error: "Title is required." };
    if (!category) return { ok: false, error: "Category is required." };
    if (isNaN(price) || price < 0) return { ok: false, error: "Invalid price." };
    if (isNaN(stock) || stock < 0) return { ok: false, error: "Invalid stock." };

    const baseSlug = rawSlug ? toSlug(rawSlug) : toSlug(title);
    if (!baseSlug) return { ok: false, error: "Could not generate a valid slug from the title." };

    const slug = await uniqueSlug(baseSlug);

    const images = (imagesText ?? "")
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      // deduplicate
      .filter((url, idx, arr) => arr.indexOf(url) === idx);

    let addOns: any[] = [];
    try { addOns = JSON.parse(addOnsText); } catch { addOns = []; }

    await prisma.product.create({
      data: { title, slug, description, price, stock, category, images, addOns },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/shop/${slug}`);
    revalidatePath("/portfolio");
    revalidatePath("/");

    return { ok: true, message: `Artwork "${title}" created successfully!` };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { ok: false, error: error?.message || "Failed to create artwork." };
  }
}

export async function updateProduct(
  productId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAdmin();

    const title = (formData.get("title") as string)?.trim();
    const rawSlug = (formData.get("slug") as string)?.trim();
    const description = (formData.get("description") as string)?.trim();
    const price = parseFloat(formData.get("price") as string);
    const stock = parseInt(formData.get("stock") as string);
    const category = (formData.get("category") as string)?.trim();
    const imagesText = formData.get("images") as string;
    const addOnsText = (formData.get("addOns") as string)?.trim() || "[]";

    if (!title) return { ok: false, error: "Title is required." };
    if (!category) return { ok: false, error: "Category is required." };
    if (isNaN(price) || price < 0) return { ok: false, error: "Invalid price." };
    if (isNaN(stock) || stock < 0) return { ok: false, error: "Invalid stock." };

    const baseSlug = rawSlug ? toSlug(rawSlug) : toSlug(title);
    if (!baseSlug) return { ok: false, error: "Could not generate a valid slug." };

    const slug = await uniqueSlug(baseSlug, productId);

    const images = (imagesText ?? "")
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .filter((url, idx, arr) => arr.indexOf(url) === idx);

    let addOns: any[] = [];
    try { addOns = JSON.parse(addOnsText); } catch { addOns = []; }

    await prisma.product.update({
      where: { id: productId },
      data: { title, slug, description, price, stock, category, images, addOns },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/shop/${slug}`);
    revalidatePath("/portfolio");
    revalidatePath("/");

    return { ok: true, message: `Artwork "${title}" updated successfully!` };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { ok: false, error: error?.message || "Failed to update artwork." };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  try {
    await requireAdmin();

    const product = await prisma.product.findUnique({ where: { id: productId } });
    await prisma.product.delete({ where: { id: productId } });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/portfolio");
    revalidatePath("/");

    return { ok: true, message: `Artwork "${product?.title ?? productId}" deleted.` };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { ok: false, error: error?.message || "Failed to delete artwork." };
  }
}
