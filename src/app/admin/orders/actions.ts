"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendOrderStatusEmail, sendEmail } from "@/lib/email";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// Strict Allowed State Transitions State Machine
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PAID: ["IN_PROGRESS"],
  IN_PROGRESS: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
};

export interface AdminActionResult {
  ok: boolean;
  error?: string;
  message?: string;
  refundId?: string;
}

/**
 * Server Action: Update Order Status
 * Enforces admin authorization via session user id, strict state machine transitions, audit logging, and revalidates path.
 */
export async function updateOrderStatus(
  orderId: string,
  newStatus: string
): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Auth guard: Lookup admin in DB by session.user.id
  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized admin access");

  const currentOrder = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!currentOrder) throw new Error("Order not found");

  // Validate state transition against state machine
  const allowedNext = ALLOWED_TRANSITIONS[currentOrder.status] || [];
  if (!allowedNext.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentOrder.status} to ${newStatus}.`);
  }

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus as any },
    include: { user: true, items: { include: { product: true } } },
  });

  // Create persistent database AuditLog entry
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "UPDATE_ORDER_STATUS",
      orderId: updatedOrder.id,
      details: {
        fromStatus: currentOrder.status,
        toStatus: newStatus,
        adminEmail: admin.email,
      },
    },
  }).catch((err) => console.error("Failed to write audit log:", err));

  // Send email notification
  if (updatedOrder.user?.email) {
    await sendOrderStatusEmail(updatedOrder.user.email, {
      orderId: updatedOrder.id,
      status: newStatus,
      items: updatedOrder.items.map((item) => ({
        title: item.product.title,
        price: item.price,
        quantity: item.quantity,
      })),
      total: updatedOrder.total,
    }).catch((err) => console.error("Admin order status update email failed:", err));
  }

  revalidatePath("/admin/orders");
  console.log(`[AUDIT LOG] Admin ${admin.email || admin.id} updated order #${orderId} status from ${currentOrder.status} to ${newStatus} at ${new Date().toISOString()}`);
}

/**
 * Server Action: Process Refund for REFUND_REQUIRED, CANCELLED, or PAID/IN_PROGRESS orders
 * 
 * SECURITY & CONCURRENCY HARDENING:
 * 1. Captures previousStatus BEFORE atomic claim.
 * 2. Pre-checks Razorpay REST API for existing refunds to prevent duplicate refund charges.
 * 3. Uses REFUND_PENDING intermediate claim state so concurrent calls or crashes cannot duplicate refunds.
 * 4. Restocks artwork ONLY if previousStatus was PAID or IN_PROGRESS (pre-dispatch). Excludes REFUND_REQUIRED, SHIPPED, and DELIVERED.
 * 5. Performs restocking inside an atomic Prisma transaction.
 * 6. Writes a persistent AuditLog record to the database.
 * 7. Rejects mock refunds strictly in production environment.
 */
export async function processAdminRefund(orderId: string): Promise<void> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Not authenticated");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!admin || admin.role !== "ADMIN") throw new Error("Unauthorized admin access");

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } }, user: true },
  });

  if (!order) throw new Error("Order not found");
  if (!order.paymentId) throw new Error("No Razorpay paymentId associated with this order");
  const VALID_REFUND_STATUSES = ["PAID", "IN_PROGRESS", "SHIPPED", "DELIVERED", "REFUND_REQUIRED"];
  if (!VALID_REFUND_STATUSES.includes(order.status)) {
    throw new Error(`Order status '${order.status}' cannot be refunded.`);
  }

  // Capture previousStatus BEFORE claim
  const previousStatus = order.status;
  const hasRazorpayKeys = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

  // Check environment rules for mock refunding
  if (!hasRazorpayKeys) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Razorpay API credentials missing in production environment. Refund aborted.");
    }
    if (process.env.ENABLE_MOCK_REFUNDS !== "true") {
      throw new Error("Razorpay keys missing. Enable ENABLE_MOCK_REFUNDS=true in development to simulate refunds.");
    }
  }

  const auth = hasRazorpayKeys
    ? Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64")
    : null;

  // 1. Fetch Existing Refunds from Razorpay API to prevent duplicate issue calls
  if (hasRazorpayKeys && auth) {
    try {
      const fetchRefundsRes = await fetch(
        `https://api.razorpay.com/v1/payments/${order.paymentId}/refunds`,
        {
          method: "GET",
          headers: { Authorization: `Basic ${auth}` },
        }
      );

      if (fetchRefundsRes.ok) {
        const refundsData = await fetchRefundsRes.json();
        if (Array.isArray(refundsData.items) && refundsData.items.length > 0) {
          const totalRefundedPaise = refundsData.items
            .filter((r: any) => r.status === "processed" || r.status === "pending")
            .reduce((sum: number, r: any) => sum + (r.amount || 0), 0);
          const orderTotalPaise = Math.round(order.total * 100);

          if (totalRefundedPaise >= orderTotalPaise) {
            const existingRzpRefund = refundsData.items[0];
            console.log(`Full Razorpay refund already exists for payment ${order.paymentId}: ${existingRzpRefund.id}`);

            await prisma.order.update({
              where: { id: orderId },
              data: { status: "REFUNDED", razorpayRefundId: existingRzpRefund.id },
            });

            const autoRestockStatuses = ["PAID", "IN_PROGRESS"];
            if (autoRestockStatuses.includes(previousStatus)) {
              await prisma.$transaction(
                order.items.map((item) =>
                  prisma.product.updateMany({
                    where: { id: item.productId },
                    data: { stock: { increment: item.quantity } },
                  })
                )
              );
            }

            await prisma.auditLog.create({
              data: {
                adminId: admin.id,
                action: "VERIFY_EXISTING_REFUND",
                orderId,
                details: { existingRefundId: existingRzpRefund.id, total: order.total, totalRefundedPaise },
              },
            }).catch(() => {});

            revalidatePath("/admin/orders");
            return;
          } else {
            console.warn(`Partial Razorpay refund detected (${totalRefundedPaise} / ${orderTotalPaise} paise) for payment ${order.paymentId}. Proceeding with full refund flow.`);
          }
        }
      }
    } catch (checkErr) {
      console.warn("Failed to check existing Razorpay refunds:", checkErr);
    }
  }

  // 2. Atomic Claim: Move status from previousStatus to REFUND_PENDING
  const claimResult = await prisma.order.updateMany({
    where: {
      id: orderId,
      status: previousStatus,
      razorpayRefundId: null,
    },
    data: { status: "REFUND_PENDING" },
  });

  if (claimResult.count === 0 && previousStatus !== "REFUND_PENDING") {
    throw new Error("Order refund in progress or processed by a concurrent request.");
  }

  let razorpayRefundId: string | null = null;

  // 3. Call Razorpay REST API
  if (hasRazorpayKeys && auth) {
    try {
      const refundRes = await fetch(
        `https://api.razorpay.com/v1/payments/${order.paymentId}/refund`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: Math.round(order.total * 100) }),
        }
      );

      const refundData = await refundRes.json();
      if (!refundRes.ok) {
        // Revert status on Razorpay API error
        await prisma.order.updateMany({
          where: { id: orderId, status: "REFUND_PENDING" },
          data: { status: previousStatus },
        });
        throw new Error(refundData?.error?.description || "Razorpay API refund call failed.");
      }
      razorpayRefundId = refundData.id;
    } catch (apiErr: any) {
      await prisma.order.updateMany({
        where: { id: orderId, status: "REFUND_PENDING" },
        data: { status: previousStatus },
      });
      throw new Error("Network error during Razorpay refund call: " + apiErr.message);
    }
  } else {
    razorpayRefundId = `ref_mock_dev_${Date.now()}`;
  }

  // 4. Update Order Status and Refund ID together
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "REFUNDED",
      razorpayRefundId,
    },
  });

  // 5. Restock artwork ONLY for pre-dispatch statuses (PAID and IN_PROGRESS) inside a transaction
  const autoRestockStatuses = ["PAID", "IN_PROGRESS"];
  if (autoRestockStatuses.includes(previousStatus)) {
    await prisma.$transaction(
      order.items.map((item) =>
        prisma.product.updateMany({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        })
      )
    );
  }

  // 6. Write persistent Database AuditLog
  await prisma.auditLog.create({
    data: {
      adminId: admin.id,
      action: "PROCESS_ADMIN_REFUND",
      orderId,
      details: {
        razorpayRefundId,
        amount: order.total,
        previousStatus,
        adminEmail: admin.email,
        restocked: autoRestockStatuses.includes(previousStatus),
      },
    },
  }).catch((err) => console.error("Failed to write refund audit log:", err));

  // 7. Send Customer Email Notification
  const customerEmail = order.user?.email;
  if (customerEmail) {
    await sendEmail({
      to: customerEmail,
      subject: `Refund Issued - Order #${order.id} - Vinyas Studio`,
      html: `
        <h2>Refund Processed ✓</h2>
        <p>Dear Collector,</p>
        <p>Your refund of <strong>₹${order.total.toLocaleString("en-IN")}</strong> for order <strong>#${order.id}</strong> has been successfully processed.</p>
        <p>Razorpay Refund Reference: <code>${razorpayRefundId}</code></p>
        <p>The funds will appear on your statement within 3–5 business days.</p>
      `,
      text: `Refund of ₹${order.total} for order #${order.id} processed. Reference: ${razorpayRefundId}`,
    }).catch((err) => console.error("Customer refund email failed:", err));
  }

  revalidatePath("/admin/orders");
  console.log(`[AUDIT LOG] Admin ${admin.email || admin.id} issued refund ${razorpayRefundId} for order #${orderId} (total: ₹${order.total}) at ${new Date().toISOString()}`);
}
