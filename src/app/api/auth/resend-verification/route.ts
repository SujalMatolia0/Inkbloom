import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createVerificationToken } from "@/lib/tokens";
import { sendSetPasswordEmail, sendVerificationEmail } from "@/lib/email";
import { TokenType } from "@prisma/client";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/**
 * API: POST /api/auth/resend-verification
 * Resends activation or email verification links safely with mail-bombing limits
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
    const clientIp = getClientIp(request);

    // Dual Rate Limiting (IP: 5/hr, Email: 3/hr to stop mail bombing)
    const ipCheck = await checkRateLimit(clientIp, "resend-ip", 5, 3600);
    if (!ipCheck.success) {
      return NextResponse.json(
        { error: "Too many resend requests from this IP. Please try again later." },
        { status: 429 }
      );
    }

    const emailCheck = await checkRateLimit(cleanEmail, "resend-email", 3, 3600);
    if (!emailCheck.success) {
      return NextResponse.json(
        { error: "Too many requests for this email address. Please check your inbox or try again in an hour." },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (user && !user.emailVerified) {
      if (!user.password) {
        // Passwordless user: Send set-password activation link
        const { rawToken } = await createVerificationToken(
          cleanEmail,
          TokenType.PASSWORD_SET,
          1
        );
        const setPasswordUrl = `${appUrl}/set-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;
        await sendSetPasswordEmail(cleanEmail, setPasswordUrl).catch((err) =>
          console.error("Failed to resend set-password email:", err)
        );
      } else {
        // User with password: Send email verification link
        const { rawToken } = await createVerificationToken(
          cleanEmail,
          TokenType.EMAIL_VERIFICATION,
          24
        );
        const verifyUrl = `${appUrl}/verify-email?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;
        await sendVerificationEmail(cleanEmail, verifyUrl).catch((err) =>
          console.error("Failed to resend verification email:", err)
        );
      }
    }

    // Uniform 202 response to prevent email enumeration
    return NextResponse.json(
      { success: true, message: "If an account exists, a verification link has been sent to your email." },
      { status: 202 }
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email. Please try again." },
      { status: 500 }
    );
  }
}
