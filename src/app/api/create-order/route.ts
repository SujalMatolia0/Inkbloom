import { POST as checkoutCreateOrder } from "@/app/api/checkout/create-order/route";

/**
 * Alias Route: POST /api/create-order
 * Delegates directly to canonical hardened /api/checkout/create-order
 */
export async function POST(req: Request) {
  return checkoutCreateOrder(req);
}
