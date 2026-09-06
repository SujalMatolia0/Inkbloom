import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, cartTotal } = await req.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, message: "Please enter a valid coupon code." },
        { status: 400 }
      );
    }

    if (typeof cartTotal !== "number" || cartTotal <= 0) {
      return NextResponse.json(
        { valid: false, message: "Your cart is empty." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Query coupon from database
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { valid: false, message: `Coupon "${cleanCode}" is not recognized or has ended.` },
        { status: 404 }
      );
    }

    // Check expiration date
    if (coupon.validUntil && new Date() > new Date(coupon.validUntil)) {
      return NextResponse.json(
        { valid: false, message: `Coupon "${cleanCode}" has expired.` },
        { status: 400 }
      );
    }

    // Check minimum order amount
    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return NextResponse.json(
        {
          valid: false,
          message: `Code "${cleanCode}" requires a minimum order of ₹${coupon.minOrderAmount.toLocaleString("en-IN")}. Add ₹${(coupon.minOrderAmount - cartTotal).toLocaleString("en-IN")} more to apply.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(coupon.discountValue, cartTotal);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: discount,
      festivalName: coupon.festivalName,
      minOrderAmount: coupon.minOrderAmount,
      newTotal: Math.max(0, cartTotal - discount),
      message: `${coupon.festivalName ? coupon.festivalName + ": " : ""}${coupon.description}`,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Error validating coupon. Please try again." },
      { status: 500 }
    );
  }
}

// GET: Return active festival offers for frontend banners and quick-apply chips
export async function GET() {
  try {
    const activeCoupons = await prisma.coupon.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    });

    return NextResponse.json({ coupons: activeCoupons });
  } catch (error) {
    console.error("Error fetching active coupons:", error);
    return NextResponse.json({ coupons: [] }, { status: 500 });
  }
}
