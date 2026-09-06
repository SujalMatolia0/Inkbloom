import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * API: Verify Razorpay Payment Signature
 * Uses HMAC SHA256 to verify the payment was processed by Razorpay.
 * Creates the order in a database transaction with stock validation.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      items,
      total,
      address,
      couponCode,
      discount,
    } = await req.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { verified: false, error: "Missing payment details" },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { verified: false, error: "No items provided" },
        { status: 400 }
      );
    }

    // Use session userId if available, otherwise use the provided userId
    const effectiveUserId = session?.user?.id || userId;
    if (!effectiveUserId) {
      return NextResponse.json(
        { verified: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
    const isDemoMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes("placeholder") || process.env.RAZORPAY_KEY_ID === "your_razorpay_key_id_here";

    // Hash the combination of order_id and payment_id
    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature && !(isDemoMode && razorpay_signature === "demo_signature")) {
      return NextResponse.json(
        { verified: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Signature is valid — create order in a transaction
    try {
      // First, validate stock availability
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) {
          return NextResponse.json(
            { verified: true, error: `Product ${item.productId} not found` },
            { status: 400 }
          );
        }
        if (product.stock < item.quantity) {
          return NextResponse.json(
            { verified: true, error: `${product.title} is out of stock` },
            { status: 400 }
          );
        }
      }

      // Create order and decrement stock in a transaction
      const order = await prisma.$transaction(async (tx) => {
        // Create the order
        const newOrder = await tx.order.create({
          data: {
            userId: effectiveUserId,
            total: total || 0,
            address: address || "Not provided",
            paymentId: razorpay_payment_id,
            status: 'PENDING',
            couponCode: couponCode ? String(couponCode).trim().toUpperCase() : null,
            discount: typeof discount === 'number' ? discount : 0,
            items: {
              create: items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        });

        // Decrement stock for each item
        for (const item of items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        // Increment coupon usedCount if valid coupon provided
        if (couponCode) {
          try {
            await tx.coupon.update({
              where: { code: String(couponCode).trim().toUpperCase() },
              data: { usedCount: { increment: 1 } },
            });
          } catch (couponError) {
            console.warn("Could not increment coupon usedCount:", couponError);
          }
        }

        return newOrder;
      });

      // Send order confirmation email (outside transaction)
      try {
        const user = await prisma.user.findUnique({
          where: { id: effectiveUserId },
        });
        if (user?.email) {
          await sendOrderConfirmationEmail(user.email, {
            id: order.id,
            items: order.items.map((item: any) => ({
              title: item.product.title,
              price: item.price,
              quantity: item.quantity,
            })),
            total: total || 0,
            address: address || "Not provided",
          });
        }
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
        // Don't fail the order for email errors
      }

      return NextResponse.json({ 
        verified: true, 
        orderId: order.id 
      });
    } catch (dbError) {
      console.error("Failed to save order:", dbError);
      return NextResponse.json({ 
        verified: true, 
        warning: "Payment verified but order save failed",
        paymentId: razorpay_payment_id 
      });
    }
  } catch (error) {
    console.error("Razorpay verification failed:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
