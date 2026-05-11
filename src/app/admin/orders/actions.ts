"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendOrderStatusEmail } from "@/lib/email";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function updateOrderStatus(orderId: string, newStatus: string) {
  // Auth guard — admin only
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Not authenticated");
  const admin = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!admin || admin.role !== "ADMIN") throw new Error("Not authorized");

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus as any },
      include: { user: true, items: { include: { product: true } } },
    });

    // Send email notification
    if (order.user?.email) {
      await sendOrderStatusEmail(order.user.email, {
        orderId: order.id,
        status: newStatus,
        items: order.items.map((item) => ({
          title: item.product.title,
          price: item.price,
          quantity: item.quantity,
        })),
        total: order.total,
      });
    }

    revalidatePath("/admin/orders");
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
}
