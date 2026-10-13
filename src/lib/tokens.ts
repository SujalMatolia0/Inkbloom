import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { TokenType } from "@prisma/client";

/**
 * Creates a single-use token stored as a SHA-256 hash in VerificationToken table.
 * Preserves existing valid tokens so mail bursts do not invalidate active links,
 * but caps maximum active unexpired tokens to 3 per identifier & type to prevent spam bloat.
 */
export async function createVerificationToken(
  identifier: string,
  type: TokenType,
  expiresInHours: number = 1
): Promise<{ rawToken: string; expires: Date }> {
  const cleanIdentifier = identifier.trim().toLowerCase();
  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expires = new Date(Date.now() + expiresInHours * 3600 * 1000);

  // Cap live tokens per identifier & type to max 3 (delete oldest if count >= 3)
  const existingTokens = await prisma.verificationToken.findMany({
    where: {
      identifier: cleanIdentifier,
      type,
      expires: { gt: new Date() },
    },
    orderBy: { createdAt: "asc" },
  });

  if (existingTokens.length >= 3) {
    const toDelete = existingTokens.slice(0, existingTokens.length - 2);
    await prisma.verificationToken.deleteMany({
      where: {
        id: { in: toDelete.map((t) => t.id) },
      },
    });
  }

  // Store new hashed token
  await prisma.verificationToken.create({
    data: {
      identifier: cleanIdentifier,
      tokenHash,
      type,
      expires,
    },
  });

  return { rawToken, expires };
}

/**
 * Verifies and atomically consumes a SHA-256 hashed token using single-step deleteMany.
 * Eliminates race conditions under concurrent requests. Returns success = true iff 1 record was deleted.
 */
export async function verifyAndConsumeToken(
  rawToken: string,
  identifier: string,
  type: TokenType
): Promise<{ success: boolean; identifier?: string }> {
  if (!rawToken || !identifier) return { success: false };

  const cleanIdentifier = identifier.trim().toLowerCase();
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const res = await prisma.verificationToken.deleteMany({
    where: {
      tokenHash,
      identifier: cleanIdentifier,
      type,
      expires: {
        gt: new Date(),
      },
    },
  });

  return { success: res.count === 1, identifier: cleanIdentifier };
}

/**
 * Deletes ALL verification tokens for an identifier across all types.
 * Invoked after successful password setup or reset to ensure old links cannot be reused.
 */
export async function deleteAllTokensForIdentifier(identifier: string): Promise<number> {
  const cleanIdentifier = identifier.trim().toLowerCase();
  const res = await prisma.verificationToken.deleteMany({
    where: {
      identifier: cleanIdentifier,
    },
  });
  return res.count;
}

/**
 * Deletes all expired tokens from the VerificationToken table.
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const res = await prisma.verificationToken.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  });
  return res.count;
}
