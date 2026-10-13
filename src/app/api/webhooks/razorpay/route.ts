import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { finalizeOrder } from "@/lib/checkout";

/**
 * API: POST /api/webhooks/razorpay
 * Razorpay Automated Webhook Handler
 *
 * RESILIENCY & VERIFICATION HARDENED:
 * 1. Requires explicit RAZORPAY_WEBHOOK_SECRET (fails closed if unconfigured).
 * 2. Timing-safe HMAC-SHA256 signature verification.
 * 3. Idempotent processing via atomic DB order claim in finalizeOrder.
 * 4. Verifies payment status === "captured" and currency === "INR".
 * 5. Verifies payment amount matches server DB order total before finalization.
 */
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Fail closed if webhook secret is not configured on server
    if (!webhookSecret) {
      console.error("Razorpay Webhook Error: RAZORPAY_WEBHOOK_SECRET environment variable is missing.");
      return NextResponse.json({ error: "Webhook secret unconfigured on server" }, { status: 500 });
    }

    if (!webhookSignature) {
      return NextResponse.json({ error: "Missing x-razorpay-signature header" }, { status: 400 });
    }

    // 1. Verify webhook HMAC-SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    const genBuf = Buffer.from(expectedSignature, "utf-8");
    const sigBuf = Buffer.from(webhookSignature, "utf-8");

    if (genBuf.length !== sigBuf.length || !crypto.timingSafeEqual(genBuf, sigBuf)) {
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    }

    // 2. Parse payload and validate event
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "order.paid" || event === "payment.captured") {
      const payment = payload.payload?.payment?.entity;
      const razorpayOrderId = payment?.order_id;
      const paymentId = payment?.id;
      const paymentAmount = payment?.amount;
      const paymentCurrency = payment?.currency;
      const paymentStatus = payment?.status;

      if (razorpayOrderId && paymentId) {
        // Validate currency and capture status
        if (paymentCurrency !== "INR") {
          console.warn(`Razorpay Webhook: Non-INR currency ignored (${paymentCurrency})`);
          return NextResponse.json({ received: true, ignored: true, reason: "invalid_currency" });
        }

        if (paymentStatus !== "captured") {
          console.warn(`Razorpay Webhook: Payment not captured yet (${paymentStatus})`);
          return NextResponse.json({ received: true, ignored: true, reason: "not_captured" });
        }

        // Verify captured amount against DB order total
        const dbOrder = await prisma.order.findUnique({
          where: { razorpayOrderId },
          select: { total: true },
        });

        if (!dbOrder) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const expectedAmountInPaise = Math.round(dbOrder.total * 100);
        if (paymentAmount !== expectedAmountInPaise) {
          console.error(`Razorpay Webhook: Amount mismatch! Payment amount: ${paymentAmount}, Order total in paise: ${expectedAmountInPaise}`);
          return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
        }

        console.log(`Razorpay Webhook: Finalizing ${event} for order ${razorpayOrderId}, payment ${paymentId}`);
        await finalizeOrder(razorpayOrderId, paymentId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler error" }, { status: 500 });
  }
}
