import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { finalizeOrder } from "@/lib/checkout";

/**
 * API: Verify Razorpay Payment Signature
 * ARCHITECTURE HARDENED:
 * 1. Verifies HMAC-SHA256 signature using timing-safe comparison.
 * 2. Checks order ownership (`dbOrder.userId === userId`).
 * 3. Calls shared `finalizeOrder` helper which handles atomic order claim, atomic stock decrement,
 *    and out-of-stock refund tracking outside transactions.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { verified: false, error: "Authentication required to complete order" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Validate required payload parameters
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Missing payment verification parameters" },
        { status: 400 }
      );
    }

    // 2. Timing-Safe HMAC-SHA256 Signature Verification
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { verified: false, error: "Razorpay API key secret missing on server" },
        { status: 500 }
      );
    }

    const bodyData = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", keySecret)
      .update(bodyData)
      .digest("hex");

    const genBuf = Buffer.from(generated_signature, "utf-8");
    const sigBuf = Buffer.from(razorpay_signature, "utf-8");

    const isSignatureValid =
      genBuf.length === sigBuf.length &&
      crypto.timingSafeEqual(genBuf, sigBuf);

    if (!isSignatureValid) {
      return NextResponse.json(
        { verified: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 3. User Ownership Verification
    const dbOrder = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      select: { id: true, userId: true },
    });

    if (!dbOrder) {
      return NextResponse.json(
        { verified: false, error: "No database order found matching this Razorpay order ID" },
        { status: 404 }
      );
    }

    if (dbOrder.userId !== userId) {
      return NextResponse.json(
        { verified: false, error: "Unauthorized access to order" },
        { status: 403 }
      );
    }

    // 4. Delegate to shared atomic order finalizer
    const result = await finalizeOrder(razorpay_order_id, razorpay_payment_id);

    if (result.ok) {
      return NextResponse.json({
        verified: true,
        orderId: result.orderId,
      });
    } else {
      return NextResponse.json(
        { verified: false, error: result.message || "Order finalization failed" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Razorpay verification failed:", error);
    return NextResponse.json(
      { verified: false, error: "Internal payment verification error" },
      { status: 500 }
    );
  }
}
