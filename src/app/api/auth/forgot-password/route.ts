import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/email";
import { TokenType } from "@prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * API: POST /api/auth/forgot-password
 * Password Reset Link Request Endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Dual Rate Limiting (IP: 5/hr, Email: 3/hr)
    const clientIp = getClientIp(request);
    const ipCheck = await checkRateLimit(clientIp, "forgot-password-ip", 5, 3600);
    if (!ipCheck.success) {
      return NextResponse.json(
        { error: "Too many password reset requests from this IP. Please try again later." },
        { status: 429 }
      );
    }

    const emailCheck = await checkRateLimit(cleanEmail, "forgot-password-email", 3, 3600);
    if (!emailCheck.success) {
      return NextResponse.json(
        { error: "Too many requests for this email address. Please check your inbox or try again in an hour." },
        { status: 429 }
      );
    }

    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

    if (process.env.NODE_ENV === "production" && !appUrl) {
      console.error("FATAL: Server app URL environment variable (APP_URL / NEXTAUTH_URL / NEXT_PUBLIC_APP_URL) is unconfigured in production!");
      return NextResponse.json(
        { error: "Password reset system configuration issue. Please contact support." },
        { status: 500 }
      );
    }

    const finalAppUrl = appUrl || "http://localhost:3000";

    // Perform token creation and email dispatch in background via after() to ensure constant timing and response
    const handleResetEmail = async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        if (user) {
          const { rawToken } = await createVerificationToken(
            cleanEmail,
            TokenType.PASSWORD_RESET,
            1
          );
          const resetUrl = `${finalAppUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;
          await sendPasswordResetEmail(cleanEmail, resetUrl);
        }
      } catch (err) {
        console.error("Background forgot-password email processing error:", err);
      }
    };

    try {
      after(handleResetEmail);
    } catch {
      // Fallback if after() is unavailable
      handleResetEmail();
    }

    // Always return fast, uniform 200 response to prevent timing enumeration attacks
    return NextResponse.json({
      success: true,
      message: "If an account exists for this email address, password reset instructions have been sent.",
    });
  } catch (error) {
    console.error("Forgot password handler error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
