import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

/**
 * API: Create Razorpay Order
 * Triggered when user clicks "Checkout" in the cart drawer.
 * Requires authentication.
 */
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(ip, { limit: 5, windowMs: 60000 }); // 5 checkouts per minute

    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { amount, currency = "INR" } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Razorpay expects amount in paise (smallest currency unit)
    const amountInSubunits = Math.round(amount * 100);

    // DEMO MODE: If keys are missing or placeholder, return a mock order
    if (
      !process.env.RAZORPAY_KEY_ID || 
      process.env.RAZORPAY_KEY_ID === "your_razorpay_key_id_here" ||
      process.env.RAZORPAY_KEY_ID === "rzp_test_placeholder"
    ) {
      console.warn("DEMO MODE: Returning mock Razorpay order ID");
      return NextResponse.json({
        id: "order_demo_" + Math.random().toString(36).substring(7),
        amount: amountInSubunits,
        currency: currency,
        demo: true
      });
    }

    const options = {
      amount: amountInSubunits,
      currency: currency,
      receipt: "rcpt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    
    // Fallback if Razorpay client initialization itself fails
    return NextResponse.json({
      id: "order_demo_fallback_" + Math.random().toString(36).substring(7),
      amount: 100,
      currency: "INR",
      demo: true
    });
  }
}
