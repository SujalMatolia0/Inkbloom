"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const coverImage = formData.get("coverImage") as string;
  const body = formData.get("body") as string;
  const tagsText = formData.get("tags") as string;
  const readTime = parseInt(formData.get("readTime") as string) || 5;
  const published = formData.get("published") === "on";

  const tags = tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  try {
    await prisma.post.create({
      data: {
        title,
        slug,
        coverImage,
        body,
        tags,
        readTime,
        published,
      },
    });

    revalidatePath("/admin/journal");
    revalidatePath("/journal");
    redirect("/admin/journal");
  } catch (error) {
    console.error("Failed to create post:", error);
  }
}

export async function updatePost(postId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const coverImage = formData.get("coverImage") as string;
  const body = formData.get("body") as string;
  const tagsText = formData.get("tags") as string;
  const readTime = parseInt(formData.get("readTime") as string) || 5;
  const published = formData.get("published") === "on";

  const tags = tagsText
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        slug,
        coverImage,
        body,
        tags,
        readTime,
        published,
      },
    });

    revalidatePath("/admin/journal");
    revalidatePath("/journal");
    redirect("/admin/journal");
  } catch (error) {
    console.error("Failed to update post:", error);
  }
}

export async function deletePost(postId: string) {
  try {
    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath("/admin/journal");
    revalidatePath("/journal");
  } catch (error) {
    console.error("Failed to delete post:", error);
  }
}
