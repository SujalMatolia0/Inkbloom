import { POST as checkoutVerify } from "@/app/api/checkout/verify/route";

/**
 * Alias Route: POST /api/verify-payment
 * Delegates directly to canonical hardened /api/checkout/verify
 */
export async function POST(req: Request) {
  return checkoutVerify(req);
}
