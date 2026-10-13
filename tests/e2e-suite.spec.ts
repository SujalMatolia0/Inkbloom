import { test, expect } from "@playwright/test";
import { prisma } from "../src/lib/prisma";
import { getPrivateImageUrl, deleteCloudinaryImage } from "../src/lib/cloudinary";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import fs from "fs";
import path from "path";

test.describe.serial("Vinyas Playwright End-to-End Suite", () => {
  let testProductId: string;
  let testProductPrice: number;
  const userAEmail = `user_a_${Date.now()}@e2e.test`;
  const userBEmail = `user_b_${Date.now()}@e2e.test`;
  const couponCode = `E2E_TEST_${Date.now()}`;
  let tempPngPath: string;
  let uploadedCloudinaryId: string | null = null;

  // Helper to dynamically walk filesystem and discover all exported admin API methods
  function getAdminApiEndpoints(): { path: string; method: string }[] {
    const adminDir = path.join(process.cwd(), "src", "app", "api", "admin");
    const endpoints: { path: string; method: string }[] = [];

    function walk(dir: string) {
      const entries = fs.readdirSync(dir);
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (entry === "route.ts" || entry === "route.js") {
          const fileContent = fs.readFileSync(fullPath, "utf-8");
          const methodMatches = fileContent.matchAll(
            /export\s+async\s+function\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)/g
          );
          const relDir = path.relative(path.join(process.cwd(), "src", "app"), dir);
          const routePath =
            "/" + relDir.replace(/\\/g, "/").replace(/\[([^\]]+)\]/g, "dummy_$1");

          for (const match of methodMatches) {
            endpoints.push({ path: routePath, method: match[1] });
          }
        }
      }
    }

    walk(adminDir);
    return endpoints;
  }

  interface MailpitMessage {
    Subject?: string;
    HTML?: string;
    Text?: string;
    [key: string]: unknown;
  }

  // Helper to query Mailpit inbox for emails sent during test execution
  async function getMailpitMessageFor(
    email: string,
    subjectKeyword?: string
  ): Promise<MailpitMessage> {
    for (let i = 0; i < 25; i++) {
      try {
        const res = await fetch(
          `http://127.0.0.1:8025/api/v1/search?query=${encodeURIComponent(email)}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.messages && data.messages.length > 0) {
            for (const item of data.messages) {
              if (
                !subjectKeyword ||
                item.Subject.toLowerCase().includes(subjectKeyword.toLowerCase())
              ) {
                const detailRes = await fetch(
                  `http://127.0.0.1:8025/api/v1/message/${item.ID}`
                );
                if (detailRes.ok) {
                  return await detailRes.json();
                }
              }
            }
          }
        }
      } catch {
        // Mailpit polling retry
      }
      await new Promise((r) => setTimeout(r, 400));
    }
    throw new Error(
      `Timed out waiting for Mailpit message to ${email}${
        subjectKeyword ? ` with subject containing "${subjectKeyword}"` : ""
      }`
    );
  }

  // Helper to create and verify a fresh user for test steps
  async function createVerifiedUser(email: string) {
    const passwordHash = await bcrypt.hash("Password123!", 10);
    return prisma.user.create({
      data: {
        email,
        name: "Test User",
        password: passwordHash,
        emailVerified: new Date(),
        role: "CUSTOMER",
      },
    });
  }

  test.beforeAll(async () => {
    // 0. Database Safety Guard:
    // Require E2E_DATABASE_URL to be explicitly set
    const e2eDbUrl = process.env.E2E_DATABASE_URL || "";
    if (!e2eDbUrl) {
      throw new Error(
        "SECURITY FATAL: E2E_DATABASE_URL must be explicitly configured to run E2E tests!"
      );
    }

    // Require DATABASE_URL to match E2E_DATABASE_URL
    if (process.env.DATABASE_URL !== e2eDbUrl) {
      throw new Error(
        "SECURITY FATAL: DATABASE_URL does not match E2E_DATABASE_URL! Aborting test run."
      );
    }

    const isLocalHost = e2eDbUrl.includes("localhost") || e2eDbUrl.includes("127.0.0.1");
    if (!isLocalHost) {
      if (process.env.ALLOW_E2E_ON_LIVE !== "true") {
        throw new Error(
          "SECURITY FATAL: Refusing to run E2E tests against non-local database unless ALLOW_E2E_ON_LIVE=true!"
        );
      }

      // Verify that Order table contains NO real customer orders (any order without @e2e.test)
      const realCustomerOrders = await prisma.order.count({
        where: {
          user: {
            email: {
              not: {
                contains: "@e2e.test",
              },
            },
          },
        },
      });

      if (realCustomerOrders > 0) {
        throw new Error(
          `SECURITY FATAL: Database contains ${realCustomerOrders} real customer order(s) (non-@e2e.test). Refusing to run destructive E2E tests!`
        );
      }
    }

    // Clear previous test emails in Mailpit
    try {
      await fetch("http://127.0.0.1:8025/api/v1/messages", { method: "DELETE" });
    } catch {}

    // Create temp PNG file for form upload testing
    tempPngPath = path.join(process.cwd(), "test-artifacts", "scratch", "sample_test_upload.png");
    if (!fs.existsSync(path.dirname(tempPngPath))) {
      fs.mkdirSync(path.dirname(tempPngPath), { recursive: true });
    }
    const pngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync(tempPngPath, pngBuffer);

    // Seed initial test product for E2E run
    const timestamp = Date.now();
    const product = await prisma.product.create({
      data: {
        title: `E2E Test Painting ${timestamp}`,
        slug: `e2e-test-painting-${timestamp}`,
        description: "An E2E test artwork item",
        price: 2000,
        category: "Paintings",
        stock: 5,
        images: ["/test-art.jpg"],
      },
    });
    testProductId = product.id;
    testProductPrice = product.price;

    // Seed test coupon
    await prisma.coupon.create({
      data: {
        code: couponCode,
        discountType: "FIXED",
        discountValue: 200,
        minOrderAmount: 1000,
        isActive: true,
        description: "E2E Test discount coupon",
      },
    });
  });

  test.afterAll(async () => {
    // Cleanup Cloudinary test photo if uploaded
    if (uploadedCloudinaryId) {
      try {
        await deleteCloudinaryImage(uploadedCloudinaryId, "authenticated");
      } catch (err) {
        console.error("Cloudinary cleanup error:", err);
      }
    }

    // Cleanup seeded test fixtures
    await prisma.coupon.deleteMany({
      where: { code: couponCode },
    });
    const testOrders = await prisma.order.findMany({
      where: {
        OR: [
          { user: { email: { in: [userAEmail, userBEmail] } } },
          { user: { email: { contains: "@e2e.test" } } },
        ],
      },
      select: { id: true },
    });
    if (testOrders.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: testOrders.map((o) => o.id) } },
      });
    }
    await prisma.orderItem.deleteMany({
      where: { productId: testProductId },
    });
    await prisma.order.deleteMany({
      where: {
        OR: [
          { user: { email: { in: [userAEmail, userBEmail] } } },
          { user: { email: { contains: "@e2e.test" } } },
        ],
      },
    });
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: { contains: "@e2e.test" },
      },
    });
    await prisma.commission.deleteMany({
      where: {
        contactEmail: { contains: "@e2e.test" },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: { contains: "@e2e.test" },
      },
    });
    await prisma.product.deleteMany({
      where: { id: testProductId },
    });

    if (fs.existsSync(tempPngPath)) {
      fs.unlinkSync(tempPngPath);
    }

    // Clear Mailpit messages after run
    try {
      await fetch("http://127.0.0.1:8025/api/v1/messages", { method: "DELETE" });
    } catch {}

    await prisma.$disconnect();
  });

  // Flow 1: register -> read set-password token from Mailpit sink -> set password -> login
  test("1. register -> read set-password token from DB -> set password -> login", async ({ page, request }) => {
    const regRes = await request.post("/api/auth/register", {
      data: { email: userAEmail, name: "User A" },
    });
    expect(regRes.status()).toBe(202);

    // Read email directly from Mailpit sink
    const mail = await getMailpitMessageFor(userAEmail, "Password");
    expect(mail.Subject).toContain("Password");
    const mailContent = mail.HTML || mail.Text || "";
    const tokenMatch = mailContent.match(/token=([a-f0-9]+)/i);
    expect(tokenMatch).not.toBeNull();
    const rawToken = tokenMatch![1];

    // The set-password route verifies and consumes the token atomically
    const setPassRes = await request.post("/api/auth/set-password", {
      data: { token: rawToken, password: "Password123!", email: userAEmail },
    });
    expect(setPassRes.ok()).toBe(true);

    await page.goto("/login");
    await page.fill('input[type="email"]', userAEmail);
    await page.fill('input[type="password"]', "Password123!");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/(profile|$)/);
  });

  // Flow 2: forgot-password -> read reset token from Mailpit sink -> reset -> older session rejected
  test("2. forgot-password -> reset -> older session rejected", async ({ page, request }) => {
    const email = `user_flow2_${Date.now()}@e2e.test`;
    await createVerifiedUser(email);

    await page.goto("/login");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/);

    const forgotRes = await request.post("/api/auth/forgot-password", {
      data: { email },
    });
    expect(forgotRes.ok()).toBe(true);

    // Read password reset email directly from Mailpit sink
    const resetMail = await getMailpitMessageFor(email, "Reset");
    expect(resetMail.Subject).toContain("Reset");
    const mailContent = resetMail.HTML || resetMail.Text || "";
    const tokenMatch = mailContent.match(/token=([a-f0-9]+)/i);
    expect(tokenMatch).not.toBeNull();
    const rawResetToken = tokenMatch![1];

    const resetRes = await request.post("/api/auth/reset-password", {
      data: { token: rawResetToken, password: "NewPassword456!", email },
    });
    expect(resetRes.ok()).toBe(true);

    // Access protected route with pre-existing session token -> session revoked on password change
    await page.goto("/profile");
    await page.waitForURL("/login");
    expect(page.url()).toContain("/login");
  });

  // Flow 3: add to cart + coupon -> pay with Razorpay test card -> order is PAID, stock -1, emails in Mailpit
  test("3. add to cart + coupon -> create order -> verify order is PAID, stock -1", async ({ page }) => {
    const email = `user_flow3_${Date.now()}@e2e.test`;
    await createVerifiedUser(email);

    await page.goto("/login");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/);

    const initialProduct = await prisma.product.findUnique({ where: { id: testProductId } });
    const initialStock = initialProduct!.stock;

    const createOrderRes = await page.request.post("/api/checkout/create-order", {
      data: {
        items: [{ id: testProductId, quantity: 1, price: testProductPrice }],
        address: "123 Art Street, Jaipur, Rajasthan 302001",
        phone: "9876543210",
        couponCode: couponCode,
      },
    });

    expect(createOrderRes.ok()).toBe(true);
    const orderData = await createOrderRes.json();
    const dbOrderId = orderData.dbOrderId;
    const razorpayOrderId = orderData.order_id || orderData.id;
    expect(dbOrderId).toBeDefined();

    const dbOrder = await prisma.order.findUnique({ where: { id: dbOrderId } });
    expect(dbOrder).not.toBeNull();
    expect(dbOrder?.total).toBe(1950);

    const paymentId = `pay_test_${Date.now()}`;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";
    const signature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest("hex");

    const verifyRes = await page.request.post("/api/checkout/verify", {
      data: {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      },
    });

    expect(verifyRes.ok()).toBe(true);

    const updatedOrder = await prisma.order.findUnique({ where: { id: dbOrderId } });
    expect(updatedOrder?.status).toBe("PAID");

    const updatedProduct = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(updatedProduct?.stock).toBe(initialStock - 1);

    // Real Mailpit Inbox Assertions:
    // 1. Customer Order Confirmation Email delivered to Mailpit
    const customerMail = await getMailpitMessageFor(email, "Confirmed");
    expect(customerMail.Subject).toContain("Confirmed");
    const customerHtml = customerMail.HTML || customerMail.Text || "";
    expect(customerHtml).toContain("1,950");
    expect(customerHtml).toContain("123 Art Street");

    // 2. Studio Admin Paid Order Notification delivered to Mailpit
    const studioEmail = process.env.ADMIN_EMAIL || "artistankimatolia@inkbloom.com";
    const adminMail = await getMailpitMessageFor(studioEmail, "Paid Order");
    expect(adminMail.Subject).toContain("Paid Order");
    const adminHtml = adminMail.HTML || adminMail.Text || "";
    expect(adminHtml).toContain(dbOrderId);
  });

  // Flow 4: tampered price in create-order request -> charge equals DB price
  test("4. tampered price in create-order request -> charge equals DB price", async ({ page }) => {
    const email = `user_flow4_${Date.now()}@e2e.test`;
    await createVerifiedUser(email);

    await page.goto("/login");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/);

    const tamperedRes = await page.request.post("/api/checkout/create-order", {
      data: {
        items: [{ id: testProductId, quantity: 1, price: 1 }],
        address: "456 Hackers Way, New Delhi 110001",
        phone: "9876543210",
      },
    });

    expect(tamperedRes.ok()).toBe(true);
    const data = await tamperedRes.json();

    const expectedPaise = (testProductPrice + 150) * 100;
    expect(data.amount).toBe(expectedPaise);

    const orderInDb = await prisma.order.findUnique({ where: { id: data.dbOrderId } });
    expect(orderInDb?.total).toBe(testProductPrice + 150);
  });

  // Flow 5: same payment verified twice -> stock decremented once
  test("5. same payment verified twice -> stock decremented once", async ({ page }) => {
    const email = `user_flow5_${Date.now()}@e2e.test`;
    await createVerifiedUser(email);

    await page.goto("/login");
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/);

    const prodBefore = await prisma.product.findUnique({ where: { id: testProductId } });
    const stockBefore = prodBefore!.stock;

    const createRes = await page.request.post("/api/checkout/create-order", {
      data: {
        items: [{ id: testProductId, quantity: 1, price: testProductPrice }],
        address: "789 Repeat Lane, Mumbai 400001",
        phone: "9876543210",
      },
    });
    const orderData = await createRes.json();
    const razorpayOrderId = orderData.order_id || orderData.id;
    const paymentId = `pay_test_dup_${Date.now()}`;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";
    const signature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${paymentId}`)
      .digest("hex");

    const res1 = await page.request.post("/api/checkout/verify", {
      data: {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      },
    });
    expect(res1.ok()).toBe(true);

    const prodAfterFirst = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(prodAfterFirst!.stock).toBe(stockBefore - 1);

    const res2 = await page.request.post("/api/checkout/verify", {
      data: {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      },
    });
    expect(res2.ok()).toBe(true);

    const prodAfterSecond = await prisma.product.findUnique({ where: { id: testProductId } });
    expect(prodAfterSecond!.stock).toBe(stockBefore - 1);
  });

  // Flow 6: two distinct logged-in users buying the last item concurrently -> second order is REFUND_REQUIRED/REFUNDED
  test("6. two distinct logged-in users buying last item concurrently -> second order becomes REFUND_REQUIRED or REFUNDED", async ({ browser }) => {
    const user1Email = `user1_race_${Date.now()}@e2e.test`;
    const user2Email = `user2_race_${Date.now()}@e2e.test`;
    await createVerifiedUser(user1Email);
    await createVerifiedUser(user2Email);

    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    await page1.goto("/login");
    await page1.fill('input[type="email"]', user1Email);
    await page1.fill('input[type="password"]', "Password123!");
    await page1.click('button[type="submit"]');
    await page1.waitForURL(/\/(profile|$)/);

    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto("/login");
    await page2.fill('input[type="email"]', user2Email);
    await page2.fill('input[type="password"]', "Password123!");
    await page2.click('button[type="submit"]');
    await page2.waitForURL(/\/(profile|$)/);

    const timestamp = Date.now();
    const lastItem = await prisma.product.create({
      data: {
        title: `Last Unit Art ${timestamp}`,
        slug: `last-unit-art-${timestamp}`,
        description: "Single stock item for race condition test",
        price: 3000,
        category: "Paintings",
        stock: 1,
        images: ["/test-last.jpg"],
      },
    });

    const order1Res = await page1.request.post("/api/checkout/create-order", {
      data: {
        items: [{ id: lastItem.id, quantity: 1, price: 3000 }],
        address: "User 1 Address",
        phone: "9876543210",
      },
    });
    const order1Data = await order1Res.json();

    const order2Res = await page2.request.post("/api/checkout/create-order", {
      data: {
        items: [{ id: lastItem.id, quantity: 1, price: 3000 }],
        address: "User 2 Address",
        phone: "9876543210",
      },
    });
    const order2Data = await order2Res.json();

    const rzp1 = order1Data.order_id || order1Data.id;
    const rzp2 = order2Data.order_id || order2Data.id;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "mock_secret";
    const pay1Id = `pay_test_race1_${Date.now()}`;
    const sig1 = crypto.createHmac("sha256", keySecret).update(`${rzp1}|${pay1Id}`).digest("hex");
    const pay2Id = `pay_test_race2_${Date.now()}`;
    const sig2 = crypto.createHmac("sha256", keySecret).update(`${rzp2}|${pay2Id}`).digest("hex");

    await Promise.all([
      page1.request.post("/api/checkout/verify", {
        data: { razorpay_order_id: rzp1, razorpay_payment_id: pay1Id, razorpay_signature: sig1 },
      }),
      page2.request.post("/api/checkout/verify", {
        data: { razorpay_order_id: rzp2, razorpay_payment_id: pay2Id, razorpay_signature: sig2 },
      }),
    ]);

    const dbOrder1 = await prisma.order.findUnique({ where: { id: order1Data.dbOrderId } });
    const dbOrder2 = await prisma.order.findUnique({ where: { id: order2Data.dbOrderId } });

    const statuses = [dbOrder1?.status, dbOrder2?.status];
    expect(statuses).toContain("PAID");
    expect(statuses.some((s) => s === "REFUND_REQUIRED" || s === "REFUNDED" || s === "REFUND_PENDING")).toBe(true);

    await prisma.orderItem.deleteMany({ where: { productId: lastItem.id } });
    await prisma.product.delete({ where: { id: lastItem.id } });
    await context1.close();
    await context2.close();
  });

  // Flow 7: CUSTOMER session requesting EVERY /admin page and EVERY /api/admin/** endpoint (discovered from filesystem)
  test("7. CUSTOMER session requesting /admin pages and /api/admin/** endpoints -> 401/403 or redirect", async ({ page }) => {
    const customerEmail7 = `customer_flow7_${Date.now()}@e2e.test`;
    await createVerifiedUser(customerEmail7);

    // Log in via UI as a CUSTOMER
    await page.goto("/login");
    await page.fill('input[type="email"]', customerEmail7);
    await page.fill('input[type="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/);

    // 1. Dynamically discovered endpoints from src/app/api/admin/**
    const adminEndpoints = getAdminApiEndpoints();
    expect(adminEndpoints.length).toBeGreaterThanOrEqual(8);

    for (const ep of adminEndpoints) {
      let res;
      if (ep.method === "GET") res = await page.request.get(ep.path);
      else if (ep.method === "POST") res = await page.request.post(ep.path, { data: {} });
      else if (ep.method === "PATCH") res = await page.request.patch(ep.path, { data: {} });
      else if (ep.method === "PUT") res = await page.request.put(ep.path, { data: {} });
      else if (ep.method === "DELETE") res = await page.request.delete(ep.path);

      expect([401, 403]).toContain(res!.status());
    }

    // 2. Open EVERY /admin UI page and expect redirect away to /login or /
    const adminPages = [
      "/admin",
      "/admin/orders",
      "/admin/products",
      "/admin/commissions",
      "/admin/coupons",
      "/admin/customers",
      "/admin/gallery",
      "/admin/posts",
      "/admin/testimonials",
      "/admin/faqs",
    ];

    for (const pageUrl of adminPages) {
      await page.goto(pageUrl);
      await page.waitForURL(/\/(login|$)/);
      expect(page.url()).not.toContain(pageUrl);
    }
  });

  // Flow 8: logged-in User A requesting User B's order -> denied (403/404) and B's address absent from response body
  test("8. logged-in user A requesting user B's order -> denied and B address absent", async ({ page }) => {
    const emailA = `user_a_flow8_${Date.now()}@e2e.test`;
    const emailB = `user_b_flow8_${Date.now()}@e2e.test`;
    const userA = await createVerifiedUser(emailA);
    const userB = await createVerifiedUser(emailB);

    const secretAddrA = `SECRET_ADDRESS_USER_A_${Date.now()}`;
    const secretAddrB = `SECRET_ADDRESS_USER_B_${Date.now()}`;

    const orderA = await prisma.order.create({
      data: {
        userId: userA.id,
        total: 2000,
        status: "PAID",
        address: secretAddrA,
      },
    });

    const orderB = await prisma.order.create({
      data: {
        userId: userB.id,
        total: 3000,
        status: "PAID",
        address: secretAddrB,
      },
    });

    // Log in as User A
    await page.goto("/login");
    await page.fill('input[type="email"]', emailA);
    await page.fill('input[type="password"]', "Password123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(profile|$)/);

    // Positive Control: User A fetching User A's own order -> 200 and address A present
    const fetchOwn = await page.request.get(`/api/orders/${orderA.id}`);
    expect(fetchOwn.status()).toBe(200);
    const ownBody = await fetchOwn.text();
    expect(ownBody).toContain(secretAddrA);

    // Negative IDOR Control: User A fetching User B's order -> 403 or 404, and address B MUST NOT be in response
    const fetchB = await page.request.get(`/api/orders/${orderB.id}`);
    expect([403, 404]).toContain(fetchB.status());
    const bBody = await fetchB.text();
    expect(bBody).not.toContain(secretAddrB);

    // UI Page IDOR Check: User A visiting profile orders page renders only A's info and does not render B's address
    await page.goto("/profile/orders");
    const pageContent = await page.content();
    expect(pageContent).not.toContain(secretAddrB);

    await prisma.orderItem.deleteMany({ where: { orderId: { in: [orderA.id, orderB.id] } } });
    await prisma.order.deleteMany({ where: { id: { in: [orderA.id, orderB.id] } } });
  });

  // Flow 9: submit REAL commission form with PNG -> assert upload succeeded, privacy checks run unconditionally, teardown deletes Cloudinary asset
  test("9. real commission form submission with photo -> row saved, private photo access verified", async ({ page }) => {
    const email = `comm_flow9_${Date.now()}@e2e.test`;

    await page.goto("/commission");

    // Fill real form fields on /commission page
    await page.fill('#name-input', "Art Patron");
    await page.fill('#email-input', email);
    await page.fill('#phone-input', "9876543210");
    await page.fill('#vision-input', "Paint a large terra-cotta abstract canvas.");
    
    // Check consent checkbox
    await page.check('#consent-checkbox');

    // Upload real PNG file
    await page.setInputFiles('#reference-upload', tempPngPath);
    await page.click('button[type="submit"]');

    // Query saved record in DB (poll for async processing)
    let savedComm = null;
    for (let i = 0; i < 20; i++) {
      savedComm = await prisma.commission.findFirst({
        where: { contactEmail: email },
        orderBy: { createdAt: "desc" },
      });
      if (savedComm) break;
      await new Promise((r) => setTimeout(r, 400));
    }

    expect(savedComm).not.toBeNull();
    expect(savedComm?.contactName).toBe("Art Patron");
    expect(savedComm?.instructions).toContain("terra-cotta abstract canvas");

    // Strict upload assertions: referencePublicId must NOT be null and upload must have succeeded
    expect(savedComm?.referencePublicId).not.toBeNull();
    const publicId = savedComm!.referencePublicId!;
    uploadedCloudinaryId = publicId;

    // Run privacy checks unconditionally:
    // 1. Unauthenticated direct fetch to raw Cloudinary URL on our cloud name -> MUST FAIL
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dcma5tbqk";
    const unsignedUploadUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.png`;
    const unsignedAuthUrl = `https://res.cloudinary.com/${cloudName}/image/authenticated/${publicId}.png`;

    const [resUpload, resAuth] = await Promise.all([
      page.request.get(unsignedUploadUrl),
      page.request.get(unsignedAuthUrl),
    ]);

    expect([400, 401, 403, 404]).toContain(resUpload.status());
    expect([400, 401, 403, 404]).toContain(resAuth.status());

    // 2. Server-signed authenticated URL -> contains valid signature parameters and resolves with 200 OK
    const signedUrl = getPrivateImageUrl(publicId);
    expect(signedUrl).toContain("s--");
    expect(signedUrl).toContain("/authenticated/");

    const signedRes = await page.request.get(signedUrl);
    expect(signedRes.status()).toBe(200);

    // Teardown: delete uploaded Cloudinary asset immediately
    await deleteCloudinaryImage(publicId, "authenticated");
    uploadedCloudinaryId = null;
  });
});
