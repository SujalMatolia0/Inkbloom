import { prisma } from "@/lib/prisma";
import { sendEmail, sendOrderConfirmationEmail } from "@/lib/email";
import { after } from "next/server";

export interface FinalizeResult {
  ok: boolean;
  orderId?: string;
  status?: string;
  reason?: "not_found" | "out_of_stock" | "already_processed" | "error";
  message?: string;
}

/**
 * Shared Order Finalization Core
 * Used by both /api/checkout/verify AND /api/webhooks/razorpay.
 *
 * RESILIENCY HARDENING:
 * 1. Claims order atomically (`updateMany where status: 'PENDING'`) to eliminate double-spend race conditions.
 * 2. Decrements stock atomically (`updateMany where stock >= quantity`).
 * 3. Out-of-Stock Fallback: Updates status to REFUND_REQUIRED (conditional on status: 'PENDING' so it cannot overwrite PAID/SHIPPED orders).
 * 4. Triggers immediate admin alerts to Anki and customer refund notifications when stock is exhausted.
 */
export async function finalizeOrder(razorpayOrderId: string, paymentId: string): Promise<FinalizeResult> {
  // 1. Fetch Order from DB
  const order = await prisma.order.findUnique({
    where: { razorpayOrderId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!order) {
    return { ok: false, reason: "not_found", message: "No database order found matching razorpayOrderId" };
  }

  // Fail-closed startup check: throw if E2E_MODE is set in production
  if (process.env.NODE_ENV === "production" && process.env.E2E_MODE === "true") {
    throw new Error("SECURITY FATAL: E2E_MODE cannot be set in production environment!");
  }

  const isE2EStub = process.env.E2E_MODE === "true" && !process.env.VERCEL && process.env.NODE_ENV !== "production";
  const shouldSkipRzpFetch = isE2EStub && paymentId.startsWith("pay_test_");

  // Centralized Razorpay Payment Verification (captured status, currency, amount, order_id)
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && !shouldSkipRzpFetch) {
    try {
      const { razorpay } = await import("@/lib/razorpay");
      const rzpPayment: any = await razorpay.payments.fetch(paymentId);

      if (rzpPayment) {
        if (rzpPayment.order_id && rzpPayment.order_id !== razorpayOrderId) {
          const alertMsg = `MISMATCH DETECTED: Payment ${paymentId} order_id (${rzpPayment.order_id}) does not match DB razorpayOrderId (${razorpayOrderId})`;
          console.error(alertMsg);
          await sendEmail({
            to: process.env.ADMIN_EMAIL || "vinyas.artist@gmail.com",
            subject: `🚨 CRITICAL MISMATCH ALERT: Payment Order ID Mismatch - Order #${order.id}`,
            html: `<h2>🚨 Critical Payment Mismatch Alert</h2><p>${alertMsg}</p>`,
            text: alertMsg,
          }).catch(() => {});
          return { ok: false, reason: "error", message: alertMsg };
        }

        if (rzpPayment.status !== "captured") {
          return { ok: false, reason: "error", message: `Payment status is '${rzpPayment.status}', expected 'captured'. Ensure Razorpay auto-capture is enabled.` };
        }

        if (rzpPayment.currency !== "INR") {
          const alertMsg = `MISMATCH DETECTED: Payment ${paymentId} currency is '${rzpPayment.currency}', expected 'INR'`;
          console.error(alertMsg);
          await sendEmail({
            to: process.env.ADMIN_EMAIL || "vinyas.artist@gmail.com",
            subject: `🚨 CRITICAL MISMATCH ALERT: Currency Mismatch - Order #${order.id}`,
            html: `<h2>🚨 Critical Currency Mismatch Alert</h2><p>${alertMsg}</p>`,
            text: alertMsg,
          }).catch(() => {});
          return { ok: false, reason: "error", message: alertMsg };
        }

        const expectedAmountInPaise = Math.round(order.total * 100);
        if (rzpPayment.amount !== expectedAmountInPaise) {
          const alertMsg = `MISMATCH DETECTED: Payment ${paymentId} amount (${rzpPayment.amount} paise) does not match order total (${expectedAmountInPaise} paise)`;
          console.error(alertMsg);
          await sendEmail({
            to: process.env.ADMIN_EMAIL || "vinyas.artist@gmail.com",
            subject: `🚨 CRITICAL MISMATCH ALERT: Payment Amount Mismatch - Order #${order.id}`,
            html: `<h2>🚨 Critical Amount Mismatch Alert</h2><p>${alertMsg}</p>`,
            text: alertMsg,
          }).catch(() => {});
          return { ok: false, reason: "error", message: alertMsg };
        }
      }
    } catch (rzpFetchErr) {
      console.error("Failed to verify payment details with Razorpay API (network/timeout):", rzpFetchErr);
      return { ok: false, reason: "error", message: "Razorpay payment verification network error. Retryable." };
    }
  }

  // Idempotency & Status Checks
  if (order.status !== "PENDING") {
    // If payment arrives for an order that was previously CANCELLED/expired, trigger refund & alerts
    if (order.status === "CANCELLED") {
      console.warn(`Payment received on CANCELLED order ${order.id} (paymentId: ${paymentId}). Initiating refund...`);
      const updated = await prisma.order.updateMany({
        where: { id: order.id, status: "CANCELLED" },
        data: { status: "REFUND_REQUIRED", paymentId },
      });

      let currentStatus = "REFUND_REQUIRED";

      if (updated.count > 0 && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        try {
          const auth = Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
          ).toString("base64");
          const refundRes = await fetch(
            `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ amount: Math.round(order.total * 100) }),
            }
          );
          if (refundRes.ok) {
            await prisma.order.updateMany({
              where: { id: order.id, status: "REFUND_REQUIRED" },
              data: { status: "REFUNDED" },
            });
            currentStatus = "REFUNDED";
          } else {
            const errBody = await refundRes.text();
            console.error(`Razorpay refund API error (${refundRes.status}): ${errBody}`);
          }
        } catch (refundErr) {
          console.error("Razorpay automatic refund API call exception:", refundErr);
        }
      }

      const customerEmail = order.user?.email;
      const sendCancelledRefundAlerts = async () => {
        await Promise.allSettled([
          sendEmail({
            to: process.env.ADMIN_EMAIL || "vinyas.artist@gmail.com",
            subject: `⚠️ URGENT: Late Payment on Expired Order #${order.id} (${currentStatus})`,
            html: `
              <h2>⚠️ Late Payment Received on Expired Order (${currentStatus})</h2>
              <p>A payment was captured for an order that had already expired/been cancelled.</p>
              <p><strong>Order ID:</strong> #${order.id}</p>
              <p><strong>Razorpay Payment ID:</strong> ${paymentId}</p>
              <p><strong>Customer Email:</strong> ${customerEmail || "N/A"}</p>
              <p><strong>Amount Captured:</strong> ₹${order.total.toLocaleString("en-IN")}</p>
              <p><strong>Status:</strong> ${currentStatus}</p>
            `,
            text: `URGENT: ${currentStatus} for expired order #${order.id}, Payment ${paymentId}`,
          }),
          ...(customerEmail
            ? [
                sendEmail({
                  to: customerEmail,
                  subject: `Notice Regarding Order #${order.id} - Vinyas Studio`,
                  html: `
                    <h2>Notice Regarding Your Purchase</h2>
                    <p>Dear Collector,</p>
                    <p>We received your payment for order <strong>#${order.id}</strong> after the checkout session had expired.</p>
                    <p>Your payment of <strong>₹${order.total.toLocaleString("en-IN")}</strong> ${
                    currentStatus === "REFUNDED" ? "has been automatically refunded" : "is being fully refunded"
                  } to your original payment method (3–5 business days).</p>
                    <p>Payment Reference: <code>${paymentId}</code></p>
                  `,
                  text: `Notice regarding order #${order.id}: Payment received on expired checkout. Full refund of ₹${order.total} is being processed. Reference: ${paymentId}`,
                }),
              ]
            : []),
        ]);
      };

      try {
        after(sendCancelledRefundAlerts);
      } catch {
        await sendCancelledRefundAlerts();
      }

      return {
        ok: false,
        reason: "out_of_stock",
        orderId: order.id,
        status: currentStatus,
        message: `Payment arrived for an expired checkout session. Payment captured and full refund (${currentStatus}) initiated.`,
      };
    }

    return { 
      ok: order.status === "PAID" || order.status === "IN_PROGRESS" || order.status === "SHIPPED" || order.status === "DELIVERED", 
      orderId: order.id, 
      status: order.status, 
      reason: order.status === "REFUND_REQUIRED" || order.status === "REFUNDED" ? "out_of_stock" : "already_processed",
      message: `Order status is currently ${order.status}` 
    };
  }

  try {
    let claimedByThisTx = false;

    // 2. Transaction for atomic status update & stock decrement with 15s timeout
    await prisma.$transaction(
      async (tx) => {
        // Claim order atomically using updateMany to prevent double-processing races
        const claimed = await tx.order.updateMany({
          where: { id: order.id, status: "PENDING" },
          data: { status: "PAID", paymentId },
        });

        if (claimed.count === 0) {
          // Another concurrent request or webhook already claimed it
          return;
        }

        claimedByThisTx = true;

        // Decrement stock for each item atomically
        for (const item of order.items) {
          const res = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity },
            },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          if (res.count === 0) {
            throw new Error("OUT_OF_STOCK:" + item.product.title);
          }
        }

        // Increment coupon usedCount if applied
        if (order.couponCode) {
          await tx.coupon.update({
            where: { code: order.couponCode },
            data: { usedCount: { increment: 1 } },
          }).catch(() => {});
        }
      },
      { timeout: 15000, maxWait: 5000 }
    );

    if (!claimedByThisTx) {
      return {
        ok: true,
        orderId: order.id,
        status: "PAID",
        reason: "already_processed",
        message: "Order claimed by concurrent process",
      };
    }

    // 3. Send order confirmation emails (AWAITED via Promise.allSettled so Vercel does not terminate background work)
    const customerEmail = order.user?.email || "vinyas.artist@gmail.com";

    await Promise.allSettled([
      sendOrderConfirmationEmail(customerEmail, {
        id: order.id,
        items: order.items.map((i) => ({
          title: i.product.title,
          price: i.price,
          quantity: i.quantity,
        })),
        total: order.total,
        address: order.address,
      }),
      sendEmail({
        to: process.env.ADMIN_EMAIL || "vinyas.artist@gmail.com",
        subject: `🚨 Paid Order Notification - #${order.id}`,
        html: `
          <h2>✦ Paid Order Received</h2>
          <p><strong>Order Number:</strong> #${order.id}</p>
          <p><strong>Razorpay Payment ID:</strong> ${paymentId}</p>
          <p><strong>Customer:</strong> ${order.user?.name || "Collector"} (${customerEmail})</p>
          <p><strong>Total Paid:</strong> ₹${order.total.toLocaleString("en-IN")}</p>
          <p><strong>Shipping Address:</strong> ${order.address}</p>
        `,
        text: `Paid Order Received: #${order.id}, Payment: ${paymentId}, Total: ₹${order.total}`,
      }),
    ]);

    return { ok: true, orderId: order.id, status: "PAID" };
  } catch (err: any) {
    if (err.message && err.message.startsWith("OUT_OF_STOCK")) {
      const outOfStockTitle = err.message.replace("OUT_OF_STOCK:", "");

      // OUTSIDE the failed transaction: update status conditionally (ONLY if still PENDING)
      const updated = await prisma.order.updateMany({
        where: { id: order.id, status: "PENDING" },
        data: {
          status: "REFUND_REQUIRED",
          paymentId,
        },
      });

      let currentStatus = "REFUND_REQUIRED";

      // Attempt automatic Razorpay refund via REST API if Razorpay keys are configured
      if (updated.count > 0 && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        try {
          const auth = Buffer.from(
            `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`
          ).toString("base64");
          const refundRes = await fetch(
            `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ amount: Math.round(order.total * 100) }),
            }
          );
          if (refundRes.ok) {
            await prisma.order.updateMany({
              where: { id: order.id, status: "REFUND_REQUIRED" },
              data: { status: "REFUNDED" },
            });
            currentStatus = "REFUNDED";
            console.log(`Razorpay refund auto-triggered successfully for payment ${paymentId}`);
          }
        } catch (refundErr) {
          console.error("Razorpay automatic refund API call failed:", refundErr);
        }
      }

      console.error(`ORDER ${currentStatus}: ${err.message} for order ${order.id}, payment ${paymentId}`);

      const customerEmail = order.user?.email || "vinyas.artist@gmail.com";

      // AWAIT all refund alerts to ensure delivery on serverless platforms
      await Promise.allSettled([
        // 1. Email Anki / Studio Admin immediately
        sendEmail({
          to: process.env.ADMIN_EMAIL || "vinyas.artist@gmail.com",
          subject: `⚠️ URGENT: Refund Alert for Order #${order.id} (${currentStatus})`,
          html: `
            <h2>⚠️ Urgent Refund Alert (${currentStatus})</h2>
            <p>A customer paid for an item that went out of stock during checkout.</p>
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Razorpay Payment ID:</strong> ${paymentId}</p>
            <p><strong>Customer Email:</strong> ${customerEmail}</p>
            <p><strong>Out-of-Stock Item:</strong> ${outOfStockTitle}</p>
            <p><strong>Amount Captured:</strong> ₹${order.total.toLocaleString("en-IN")}</p>
            <p><strong>Status:</strong> ${currentStatus}</p>
            ${
              currentStatus === "REFUNDED"
                ? "<p><em>Automatic refund has been issued through Razorpay.</em></p>"
                : `<p>Please log into your Razorpay Dashboard and manually refund payment <code>${paymentId}</code>.</p>`
            }
          `,
          text: `URGENT: ${currentStatus} for order #${order.id}, Payment ${paymentId}, Item: ${outOfStockTitle}`,
        }),

        // 2. Email Customer explaining full refund status
        sendEmail({
          to: customerEmail,
          subject: `Important Update Regarding Order #${order.id} - Vinyas Studio`,
          html: `
            <h2>Notice Regarding Your Purchase</h2>
            <p>Dear Collector,</p>
            <p>Thank you for choosing Vinyas Studio. During your checkout, artwork <strong>"${outOfStockTitle}"</strong> was claimed by another patron.</p>
            <p>Because our pieces are handcrafted and limited editions, your payment of <strong>₹${order.total.toLocaleString(
              "en-IN"
            )}</strong> ${
            currentStatus === "REFUNDED"
              ? "has been automatically refunded"
              : "is being fully refunded"
          } to your original payment method (3–5 business days).</p>
            <p>Payment Reference: <code>${paymentId}</code></p>
            <p>We apologize for the inconvenience and invite you to explore other pieces in our studio collection.</p>
          `,
          text: `Notice regarding order #${order.id}: Artwork "${outOfStockTitle}" went out of stock. Full refund of ₹${order.total} is ${
            currentStatus === "REFUNDED" ? "processed" : "being processed"
          }. Reference: ${paymentId}`,
        }),
      ]);

      return {
        ok: false,
        reason: "out_of_stock",
        orderId: order.id,
        status: currentStatus,
        message: `Artwork "${outOfStockTitle}" is out of stock. Payment captured and full refund (${currentStatus}) initiated.`,
      };
    }

    throw err;
  }
}
