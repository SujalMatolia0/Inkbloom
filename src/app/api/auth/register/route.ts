import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { createVerificationToken } from "@/lib/tokens";
import { sendSetPasswordEmail } from "@/lib/email";
import { TokenType } from "@prisma/client";

/**
 * API: POST /api/auth/register
 * Pre-hijacking Safe Registration & Account Verification Trigger
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email } = body;

    // 1. Input Type & Field Validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      !name.trim() ||
      !email.trim()
    ) {
      return NextResponse.json(
        { error: "Name and email are required text strings." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Name length rules
    if (cleanName.length < 2 || cleanName.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters long." },
        { status: 400 }
      );
    }

    // 2. Dual Rate Limiting (IP: 5/hr, Email: 3/hr to stop mail bombing)
    const clientIp = getClientIp(request);
    const ipCheck = await checkRateLimit(clientIp, "register-ip", 5, 3600);
    if (!ipCheck.success) {
      return NextResponse.json(
        { error: "Too many registration attempts from this IP. Please try again later." },
        { status: 429 }
      );
    }

    const emailCheck = await checkRateLimit(cleanEmail, "register-email", 3, 3600);
    if (!emailCheck.success) {
      return NextResponse.json(
        { error: "Too many requests for this email address. Please check your inbox or try again in an hour." },
        { status: 429 }
      );
    }

    // 3. Environment Host Configuration Check
    const appUrl = process.env.APP_URL || process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;

    if (process.env.NODE_ENV === "production" && !appUrl) {
      console.error("FATAL: Server app URL environment variable (APP_URL / NEXTAUTH_URL / NEXT_PUBLIC_APP_URL) is unconfigured in production!");
      return NextResponse.json(
        { error: "Registration system temporary configuration issue. Please contact support." },
        { status: 500 }
      );
    }

    const finalAppUrl = appUrl || "http://localhost:3000";

    // 4. Find or Create User Row (password = null, emailVerified = null)
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      // If user already exists WITH a password, do NOT issue set-password links or trigger email resets!
      if (existingUser.password) {
        return NextResponse.json(
          { success: true, message: "Check your email to set your password and activate your account." },
          { status: 202 }
        );
      }

      // If user exists WITHOUT a password (passwordless guest), send set-password link
      const { rawToken } = await createVerificationToken(
        cleanEmail,
        TokenType.PASSWORD_SET,
        1
      );

      const setPasswordUrl = `${finalAppUrl}/set-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;
      await sendSetPasswordEmail(cleanEmail, setPasswordUrl).catch((err) =>
        console.error("Failed to send set-password email:", err)
      );

      return NextResponse.json(
        { success: true, message: "Check your email to set your password and activate your account." },
        { status: 202 }
      );
    }

    // 5. Create New User (password = null, emailVerified = null)
    await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        password: null,
        role: "CUSTOMER",
        emailVerified: null,
      },
    });

    const { rawToken } = await createVerificationToken(
      cleanEmail,
      TokenType.PASSWORD_SET,
      1
    );

    const setPasswordUrl = `${appUrl}/set-password?token=${rawToken}&email=${encodeURIComponent(cleanEmail)}`;
    await sendSetPasswordEmail(cleanEmail, setPasswordUrl).catch((err) =>
      console.error("Failed to send set-password email:", err)
    );

    return NextResponse.json(
      { success: true, message: "Check your email to set your password and activate your account." },
      { status: 202 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: true, message: "Check your email to set your password and activate your account." },
        { status: 202 }
      );
    }

    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration service unavailable. Please try again." },
      { status: 500 }
    );
  }
}
