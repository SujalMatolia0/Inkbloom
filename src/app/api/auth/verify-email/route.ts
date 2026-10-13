import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { TokenType } from "@prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { deleteAllTokensForIdentifier } from "@/lib/tokens";

/**
 * API: POST /api/auth/verify-email
 * Email Verification Endpoint with Atomic Transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, email } = body;

    if (typeof token !== "string" || typeof email !== "string" || !token || !email) {
      return NextResponse.json(
        { error: "Token and email are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Rate limiting by IP + email
    const clientIp = getClientIp(request);
    const rateCheck = await checkRateLimit(`${clientIp}:${cleanEmail}`, "verify-email", 10, 3600);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429 }
      );
    }

    const now = new Date();

    // Execute token consumption & user verification inside a single Prisma Transaction
    const verificationResult = await prisma.$transaction(async (tx) => {
      const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
      const deletedToken = await tx.verificationToken.deleteMany({
        where: {
          tokenHash,
          identifier: cleanEmail,
          type: TokenType.EMAIL_VERIFICATION,
          expires: { gt: now },
        },
      });

      if (deletedToken.count === 0) {
        return { success: false };
      }

      await tx.user.update({
        where: { email: cleanEmail },
        data: { emailVerified: now },
      });

      return { success: true };
    });

    if (!verificationResult.success) {
      return NextResponse.json(
        { error: "Invalid or expired verification token." },
        { status: 400 }
      );
    }

    // Clean up all remaining tokens for this email
    await deleteAllTokensForIdentifier(cleanEmail).catch(() => {});

    return NextResponse.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email. Please try again." },
      { status: 500 }
    );
  }
}
