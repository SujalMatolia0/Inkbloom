import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Valid Cost-12 Bcrypt Hash for Constant-Time Execution on unknown email or missing password
const DUMMY_HASH = bcrypt.hashSync("dummy_password_timing_attack_protection_vinyas_2026", 12);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        const cleanEmail = credentials.email.trim().toLowerCase();

        // Extract IP from Next.js request headers
        const headersMap = req?.headers ? new Headers(req.headers as any) : null;
        const fakeReq = headersMap ? ({ headers: headersMap } as Request) : ({ headers: new Headers() } as Request);
        const clientIp = getClientIp(fakeReq);

        // 1a. Per-IP+Email Rate Limiting (5 attempts per 15 minutes)
        const ipEmailCheck = await checkRateLimit(`${clientIp}:${cleanEmail}`, "login-ip-email", 5, 900);
        if (!ipEmailCheck.success) {
          console.warn(`Login rate limit (IP+Email) exceeded for ${cleanEmail} from ${clientIp}`);
          return null;
        }

        // 1b. Per-Email Rate Limiting across ALL IPs (10 attempts per 15 minutes)
        const emailCheck = await checkRateLimit(cleanEmail, "login-email", 10, 900);
        if (!emailCheck.success) {
          console.warn(`Distributed login rate limit (Per-Email) exceeded for ${cleanEmail}`);
          return null;
        }

        // 2. User Lookup
        const user = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });

        // 3. Timing Attack Mitigation (Dummy Bcrypt Comparison if user/password missing)
        if (!user || !user.password) {
          await bcrypt.compare(credentials.password, DUMMY_HASH);
          return null;
        }

        // 4. Compare Password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // 5. Enforce Email Verification Requirement for Credentials Sign-In
        if (!user.emailVerified && user.role !== "ADMIN") {
          console.warn(`Sign-in attempt blocked for unverified account: ${cleanEmail}`);
          throw new Error("UNVERIFIED_EMAIL");
        }

        // 6. Return Sanitized User Object
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (!token || !token.sub) {
        return {} as any;
      }
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }

      // Session invalidation on password change using SECONDS-level timestamp comparison
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { passwordChangedAt: true, role: true },
        });

        if (!dbUser) {
          return {} as any; // Revoke token if user row no longer exists
        }

        token.role = dbUser.role;

        if (dbUser.passwordChangedAt && typeof token.iat === "number") {
          const passwordChangedSec = Math.floor(new Date(dbUser.passwordChangedAt).getTime() / 1000);
          
          // If password was changed after token issue time (seconds comparison), revoke session token cleanly
          if (passwordChangedSec > token.iat) {
            return {} as any;
          }
        }
      }

      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};
