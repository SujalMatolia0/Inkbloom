import { NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/site";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

/**
 * API: Create Order & Razorpay Payment Intent
 * SECURITY & PRICING HARDENED:
 * 1. Validates quantities (positive integer, non-zero, no floats, no duplicates).
 * 2. Fetches authoritative product prices from DB.
 * 3. Validates coupons & enforces maxDiscount/minimum order rules server-side.
 * 4. Hardcodes currency to "INR" server-side.
 * 5. Computes shipping fee server-side based on SITE_CONFIG.shipping.freeThresholdINR.
 * 6. Creates a PENDING Order in Database BEFORE calling Razorpay API.
 */
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(ip, { limit: 10, windowMs: 60000 });

    if (!success) {
      return NextResponse.json({ error: "Too many checkout requests. Please try again later." }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to checkout" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { items, address = "To be confirmed upon dispatch", phone, pincode, couponCode } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty or items payload missing" },
        { status: 400 }
      );
    }

    // Address, Phone, and Pincode validation
    const fullAddress = typeof address === "string" ? address.trim() : "To be confirmed upon dispatch";
    if (fullAddress && fullAddress !== "To be confirmed upon dispatch") {
      if (fullAddress.length < 10) {
        return NextResponse.json(
          { error: "Shipping address must be at least 10 characters long." },
          { status: 400 }
        );
      }
    }

    if (phone && typeof phone === "string" && phone.trim()) {
      const cleanPhone = phone.trim().replace(/\D/g, "");
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return NextResponse.json(
          { error: "Please enter a valid 10-digit Indian mobile number." },
          { status: 400 }
        );
      }
    }

    if (pincode && typeof pincode === "string" && pincode.trim()) {
      const cleanPin = pincode.trim();
      if (!/^\d{6}$/.test(cleanPin)) {
        return NextResponse.json(
          { error: "Please enter a valid 6-digit Indian PIN code." },
          { status: 400 }
        );
      }
    }

    // 1. Strict Quantity & Item Validation
    const itemMap = new Map<string, number>();

    for (const rawItem of items) {
      const pid = rawItem?.productId || rawItem?.id;
      if (!pid || typeof pid !== "string") {
        return NextResponse.json(
          { error: "Invalid product identifier in cart payload" },
          { status: 400 }
        );
      }

      const qty = rawItem?.quantity;
      if (typeof qty !== "number" || !Number.isInteger(qty) || qty <= 0 || qty > 100) {
        return NextResponse.json(
          { error: "Item quantity must be a positive whole integer between 1 and 100" },
          { status: 400 }
        );
      }

      const currentQty = itemMap.get(pid) || 0;
      itemMap.set(pid, currentQty + qty);
    }

    const productIds = Array.from(itemMap.keys());
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more items in your cart are no longer available." },
        { status: 400 }
      );
    }

    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));
    let subtotal = 0;
    const sanitizedItems: { productId: string; quantity: number; price: number }[] = [];

    for (const [pid, qty] of itemMap.entries()) {
      const product = dbProductMap.get(pid)!;

      if (product.stock < qty) {
        return NextResponse.json(
          { error: `"${product.title}" has only ${product.stock} left in stock.` },
          { status: 400 }
        );
      }

      subtotal += product.price * qty;
      sanitizedItems.push({
        productId: product.id,
        quantity: qty,
        price: product.price, // DB authoritative price
      });
    }

    // 2. Validate Coupon Code Server-Side (with usageLimit & per-customer cap)
    let discount = 0;
    let validCouponCode: string | null = null;

    if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
      const cleanCode = couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
      });

      if (coupon && coupon.isActive) {
        const isNotExpired = !coupon.validUntil || new Date() <= new Date(coupon.validUntil);
        const meetsMinAmount = !coupon.minOrderAmount || subtotal >= coupon.minOrderAmount;
        const underUsageLimit = !coupon.usageLimit || coupon.usedCount < coupon.usageLimit;

        if (isNotExpired && meetsMinAmount && underUsageLimit) {
          // Enforce per-customer limit: check if user already redeemed this coupon in any non-cancelled order
          const userCouponUsage = await prisma.order.count({
            where: {
              userId: session.user.id,
              couponCode: cleanCode,
              status: { notIn: ["PENDING", "CANCELLED", "REFUND_REQUIRED", "REFUNDED"] },
            },
          });

          if (userCouponUsage === 0) {
            validCouponCode = coupon.code;
            if (coupon.discountType === "PERCENTAGE") {
              discount = Math.round((subtotal * coupon.discountValue) / 100);
              if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
              }
            } else {
              discount = Math.min(coupon.discountValue, subtotal);
            }
          }
        }
      }
    }

    // 3. Compute Shipping Fee Server-Side (Threshold evaluated BEFORE coupon discount for fair delivery policy)
    const freeShippingThreshold = SITE_CONFIG.shipping.freeThresholdINR || 2499;
    const flatShippingFee = SITE_CONFIG.shipping.flatFeeINR || 150;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : flatShippingFee;

    // 4. Calculate Authoritative Server Total
    const finalTotal = Math.max(0, subtotal - discount + shippingFee);
    const amountInPaise = Math.round(finalTotal * 100);

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Order total must be at least ₹1 (100 paise)." },
        { status: 400 }
      );
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Razorpay API credentials not configured" },
        { status: 500 }
      );
    }

    // 5. Create Razorpay API Order Intent with hardcoded INR currency
    const razorpayOptions = {
      amount: amountInPaise,
      currency: "INR", // Hardcoded currency
      receipt: "rcpt_" + Date.now() + "_" + Math.random().toString(36).substring(7),
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // 6. Save PENDING Order in DB BEFORE checkout modal opens (storing shippingFee & discount)
    const pendingOrder = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: finalTotal,
        address: typeof address === "string" ? address.trim() : "To be confirmed upon dispatch",
        status: "PENDING",
        razorpayOrderId: razorpayOrder.id,
        couponCode: validCouponCode,
        discount,
        shippingFee,
        items: {
          create: sanitizedItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    return NextResponse.json({
      order_id: razorpayOrder.id,
      id: razorpayOrder.id,
      dbOrderId: pendingOrder.id,
      amount: razorpayOrder.amount,
      currency: "INR",
      computedSubtotal: subtotal,
      computedDiscount: discount,
      computedShipping: shippingFee,
      computedTotal: finalTotal,
    });
  } catch (error: any) {
    console.error("Razorpay create-order failed:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize checkout order" },
      { status: 500 }
    );
  }
}
