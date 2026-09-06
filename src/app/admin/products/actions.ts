"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== "ADMIN") throw new Error("Not authorized");
  return user;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category = formData.get("category") as string;
  const imagesText = formData.get("images") as string;

  const images = imagesText
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  try {
    await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price,
        stock,
        category,
        images,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/portfolio");
    revalidatePath("/");
    redirect("/admin/products");
  } catch (error) {
    console.error("Failed to create product:", error);
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string);
  const category = formData.get("category") as string;
  const imagesText = formData.get("images") as string;

  const images = imagesText
    .split("\n")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        slug,
        description,
        price,
        stock,
        category,
        images,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/portfolio");
    revalidatePath("/");
    redirect("/admin/products");
  } catch (error) {
    console.error("Failed to update product:", error);
  }
}

export async function deleteProduct(productId: string) {
  await requireAdmin();

  try {
    await prisma.product.delete({
      where: { id: productId },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/portfolio");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to delete product:", error);
  }
}
