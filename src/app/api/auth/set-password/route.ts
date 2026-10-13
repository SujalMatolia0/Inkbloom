import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { TokenType } from "@prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * API: POST /api/auth/set-password
 * Account Activation & Password Setup via Token Link
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

    // Rate limiting by IP and Email combined
    const clientIp = getClientIp(request);
    const rateCheck = await checkRateLimit(`${clientIp}:${cleanEmail}`, "set-password", 5, 3600);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many password set attempts. Please try again later." },
        { status: 429 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    // Atomic Prisma Transaction for Token Consumption & User Update
    const setPasswordResult = await prisma.$transaction(async (tx) => {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const deletedToken = await tx.verificationToken.deleteMany({
        where: {
          tokenHash,
          identifier: cleanEmail,
          type: TokenType.PASSWORD_SET,
          expires: { gt: now },
        },
      });

      if (deletedToken.count === 0) {
        return { success: false, reason: "invalid_token" };
      }

      await tx.user.update({
        where: { email: cleanEmail },
        data: {
          password: hashedPassword,
          passwordChangedAt: now,
          emailVerified: now,
        },
      });

      return { success: true };
    });

    if (!setPasswordResult.success) {
      return NextResponse.json(
        { error: "Invalid, expired, or previously used activation link." },
        { status: 400 }
      );
    }

    // Clean up all remaining tokens for this email
    const { deleteAllTokensForIdentifier } = await import("@/lib/tokens");
    await deleteAllTokensForIdentifier(cleanEmail).catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Password set and account activated successfully. You may now log in.",
    });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json(
      { error: "Failed to set password. Please try again." },
      { status: 500 }
    );
  }
}
