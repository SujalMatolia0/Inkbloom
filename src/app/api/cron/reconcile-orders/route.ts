import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { razorpay } from "@/lib/razorpay";
import { finalizeOrder } from "@/lib/checkout";

/**
 * API: GET /api/cron/reconcile-orders
 * Scheduled Cron Job for Order Reconciliation & Checkout Cleanup
 *
 * Scans PENDING orders older than 30 minutes:
 * 1. Checks payment status in Razorpay API.
 * 2. If Razorpay shows payment captured/paid, calls finalizeOrder.
 * 3. If abandoned or payment failed, expires the order to CANCELLED.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Fail closed: require CRON_SECRET to be configured and match Authorization header
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
    }

    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // Find pending orders created more than 30 minutes ago
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: "PENDING",
        createdAt: { lt: thirtyMinutesAgo },
      },
      take: 50,
    });

    let finalizedCount = 0;
    let cancelledCount = 0;

    for (const order of pendingOrders) {
      if (!order.razorpayOrderId) continue;

      try {
        // Fetch order details directly from Razorpay
        const rzpOrder: any = await razorpay.orders.fetch(order.razorpayOrderId);

        if (rzpOrder.status === "paid") {
          // Fetch payments associated with this order
          const payments: any = await razorpay.orders.fetchPayments(order.razorpayOrderId);
          const capturedPayment = payments.items?.find((p: any) => p.status === "captured");

          if (capturedPayment) {
            console.log(`Cron Reconcile: Finalizing paid order #${order.id} with payment ${capturedPayment.id}`);
            await finalizeOrder(order.razorpayOrderId, capturedPayment.id);
            finalizedCount++;
            continue;
          }
        }

        // If order is older than 24 hours and still unpaid/created, mark as CANCELLED
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        if (order.createdAt < twentyFourHoursAgo) {
          await prisma.order.updateMany({
            where: { id: order.id, status: "PENDING" },
            data: { status: "CANCELLED" },
          });
          cancelledCount++;
        }
      } catch (orderErr) {
        console.error(`Cron Reconcile error for order #${order.id}:`, orderErr);
      }
    }

    // Clean up expired verification tokens
    const { cleanupExpiredTokens } = await import("@/lib/tokens");
    const cleanedTokensCount = await cleanupExpiredTokens().catch(() => 0);

    return NextResponse.json({
      success: true,
      scanned: pendingOrders.length,
      finalized: finalizedCount,
      cancelled: cancelledCount,
      cleanedTokens: cleanedTokensCount,
    });
  } catch (error: any) {
    console.error("Cron reconciliation failed:", error);
    return NextResponse.json({ error: "Reconciliation job failed" }, { status: 500 });
  }
}
