import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Admin fetch coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      code,
      festivalName,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      validUntil,
    } = body;

    if (!code || !description || !discountType || typeof discountValue !== "number") {
      return NextResponse.json(
        { error: "Please provide code, description, discount type, and valid discount value." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check if code already exists
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Coupon code "${cleanCode}" already exists.` },
        { status: 400 }
      );
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        festivalName: festivalName?.trim() || null,
        description: description.trim(),
        discountType: discountType === "FIXED" ? "FIXED" : "PERCENTAGE",
        discountValue: Number(discountValue),
        minOrderAmount: minOrderAmount ? Number(minOrderAmount) : null,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error) {
    console.error("Admin create coupon error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
