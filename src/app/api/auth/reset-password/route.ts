import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { verifyAndConsumeToken } from "@/lib/tokens";
import { TokenType } from "@prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * API: POST /api/auth/reset-password
 * Password Reset Execution Endpoint with Session Invalidation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, email, password } = body;

    if (
      typeof token !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !token ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        { error: "Token, email, and new password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Password byte-length check (Bcrypt limits input to 72 BYTES)
    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        { error: "Password must be between 8 characters and 72 bytes in length." },
        { status: 400 }
      );
    }

    // Rate limiting by IP and Email
    const clientIp = getClientIp(request);
    const rateCheck = await checkRateLimit(`${clientIp}:${cleanEmail}`, "reset-password", 5, 3600);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many password reset attempts. Please try again later." },
        { status: 429 }
      );
    }

    // Hash new password with bcrypt cost factor 12
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    // Execute token consumption and user password update inside a single Prisma Transaction
    const resetResult = await prisma.$transaction(async (tx) => {
      // 1. Single-step atomic deleteMany token consumption
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const deletedToken = await tx.verificationToken.deleteMany({
        where: {
          tokenHash,
          identifier: cleanEmail,
          type: TokenType.PASSWORD_RESET,
          expires: { gt: now },
        },
      });

      if (deletedToken.count === 0) {
        return { success: false, reason: "invalid_token" };
      }

      const user = await tx.user.findUnique({
        where: { email: cleanEmail },
      });

      if (!user) {
        return { success: false, reason: "user_not_found" };
      }

      // 2. Update password, set passwordChangedAt for session invalidation, and ensure emailVerified is set
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordChangedAt: now,
          emailVerified: user.emailVerified ?? now,
          resetToken: null,
          resetTokenExpiry: null,
        },
      });

      return { success: true };
    });

    if (!resetResult.success) {
      return NextResponse.json(
        { error: "Invalid, expired, or previously used reset link." },
        { status: 400 }
      );
    }

    // Clean up all remaining tokens for this email
    const { deleteAllTokensForIdentifier } = await import("@/lib/tokens");
    await deleteAllTokensForIdentifier(cleanEmail).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Password reset successfully. You may now log in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
