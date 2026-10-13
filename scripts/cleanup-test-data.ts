import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const isApply = process.argv.includes("--apply");

  console.log(`\n======================================================`);
  console.log(`[CLEANUP TEST DATA] Running in ${isApply ? ">> APPLY <<" : "[ DRY-RUN ]"} mode`);
  console.log(`======================================================\n`);

  // 1. Identify Test Users
  const testUsers = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: "@e2e.test" } },
        { name: { in: ["Test Collector", "Security Tester", "Test User"] } },
      ],
    },
    select: { id: true, email: true, name: true },
  });
  const testUserIds = testUsers.map((u) => u.id);

  // 2. Identify Test Products
  const testProducts = await prisma.product.findMany({
    where: {
      OR: [
        { title: { startsWith: "E2E" } },
        { title: { startsWith: "Last Unit Art" } },
        { title: { in: ["Concurrent Test Artwork", "In Stock Artwork A", "Out Of Stock Artwork B"] } },
        { slug: { startsWith: "e2e-" } },
        { slug: { startsWith: "last-unit-art-" } },
        { images: { has: "https://example.com/test.jpg" } },
      ],
    },
    select: { id: true, title: true },
  });
  const testProductIds = testProducts.map((p) => p.id);

  // 3. Identify Test Coupons
  const testCoupons = await prisma.coupon.findMany({
    where: {
      OR: [
        { code: { startsWith: "E2E_TEST_" } },
        { code: { startsWith: "TESTCONCURRENT_" } },
      ],
    },
    select: { id: true, code: true },
  });
  const testCouponIds = testCoupons.map((c) => c.id);

  // 4. Identify Test Verification Tokens
  const testTokens = await prisma.verificationToken.findMany({
    where: {
      identifier: { contains: "@e2e.test" },
    },
    select: { identifier: true, tokenHash: true },
  });

  // 5. Identify Test Commissions
  const testCommissions = await prisma.commission.findMany({
    where: {
      OR: [
        { contactEmail: { contains: "@e2e.test" } },
        { contactName: { in: ["Test Collector", "Security Tester", "Art Patron", "Test User"] } },
        { instructions: { contains: "terra-cotta abstract canvas" } },
      ],
    },
    select: { id: true, contactEmail: true, contactName: true },
  });
  const testCommissionIds = testCommissions.map((c) => c.id);

  // 6. Identify Test Orders & Stale Test PENDING Orders
  const testOrders = await prisma.order.findMany({
    where: {
      OR: [
        { userId: { in: testUserIds } },
        {
          AND: [
            { status: "PENDING" },
            {
              OR: [
                { razorpayOrderId: null },
                { razorpayOrderId: { startsWith: "order_test_" } },
                { user: { email: { contains: "@e2e.test" } } },
              ],
            },
          ],
        },
      ],
    },
    select: { id: true, razorpayOrderId: true, status: true, total: true },
  });
  const testOrderIds = testOrders.map((o) => o.id);

  // 7. Identify Dependent OrderItems
  const testOrderItems = await prisma.orderItem.findMany({
    where: {
      OR: [
        { orderId: { in: testOrderIds } },
        { productId: { in: testProductIds } },
      ],
    },
    select: { id: true },
  });
  const testOrderItemIds = testOrderItems.map((oi) => oi.id);

  console.log("Candidate records found for cleanup:");
  console.log(`- OrderItems:         ${testOrderItems.length}`);
  console.log(`- Orders:             ${testOrders.length}`);
  console.log(`- Coupons:            ${testCoupons.length}`);
  console.log(`- Products:           ${testProducts.length}`);
  console.log(`- Commissions:        ${testCommissions.length}`);
  console.log(`- VerificationTokens: ${testTokens.length}`);
  console.log(`- Users:              ${testUsers.length}`);

  if (!isApply) {
    console.log(`\n[DRY RUN COMPLETE] No records were deleted.`);
    console.log(`To execute deletion, rerun with: npx tsx scripts/cleanup-test-data.ts --apply\n`);
    await prisma.$disconnect();
    return;
  }

  console.log(`\n[DELETING RECORDS IN FOREIGN-KEY ORDER...]`);

  // Deletion in strict foreign-key order
  if (testOrderItemIds.length > 0) {
    const res = await prisma.orderItem.deleteMany({
      where: { id: { in: testOrderItemIds } },
    });
    console.log(`✓ Deleted ${res.count} OrderItem(s)`);
  }

  if (testOrderIds.length > 0) {
    const res = await prisma.order.deleteMany({
      where: { id: { in: testOrderIds } },
    });
    console.log(`✓ Deleted ${res.count} Order(s)`);
  }

  if (testCouponIds.length > 0) {
    const res = await prisma.coupon.deleteMany({
      where: { id: { in: testCouponIds } },
    });
    console.log(`✓ Deleted ${res.count} Coupon(s)`);
  }

  if (testProductIds.length > 0) {
    const res = await prisma.product.deleteMany({
      where: { id: { in: testProductIds } },
    });
    console.log(`✓ Deleted ${res.count} Product(s)`);
  }

  if (testCommissionIds.length > 0) {
    const res = await prisma.commission.deleteMany({
      where: { id: { in: testCommissionIds } },
    });
    console.log(`✓ Deleted ${res.count} Commission(s)`);
  }

  if (testTokens.length > 0) {
    const res = await prisma.verificationToken.deleteMany({
      where: { identifier: { contains: "@e2e.test" } },
    });
    console.log(`✓ Deleted ${res.count} VerificationToken(s)`);
  }

  if (testUserIds.length > 0) {
    const res = await prisma.user.deleteMany({
      where: { id: { in: testUserIds } },
    });
    console.log(`✓ Deleted ${res.count} User(s)`);
  }

  console.log(`\n✓ Cleanup successfully applied!\n`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Cleanup error:", err);
  process.exit(1);
});
