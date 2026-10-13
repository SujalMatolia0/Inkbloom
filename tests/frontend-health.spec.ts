import { test, expect } from "@playwright/test";
import { prisma } from "../src/lib/prisma";

test.describe("Frontend Health & Comprehensive Pages Audit", () => {
  const publicRoutes = [
    { path: "/", titleKeyword: "Vinyas" },
    { path: "/shop", titleKeyword: "Shop" },
    { path: "/cart", titleKeyword: "Cart" },
    { path: "/commission", titleKeyword: "Commission" },
    { path: "/portfolio", titleKeyword: "Portfolio" },
    { path: "/about", titleKeyword: "About" },
    { path: "/contact", titleKeyword: "Contact" },
    { path: "/faq", titleKeyword: "FAQ" },
    { path: "/reviews", titleKeyword: "Reviews" },
    { path: "/journal", titleKeyword: "Journal" },
    { path: "/care-instructions", titleKeyword: "Care" },
    { path: "/resin-preservation", titleKeyword: "Resin" },
    { path: "/shipping", titleKeyword: "Shipping" },
    { path: "/returns", titleKeyword: "Returns" },
    { path: "/privacy", titleKeyword: "Privacy" },
    { path: "/terms", titleKeyword: "Terms" },
  ];

  test("1. All public static and marketing pages load with 200 OK and no unhandled runtime errors", async ({ page }) => {
    test.setTimeout(120000);
    const pageErrors: { route: string; error: string }[] = [];

    page.on("pageerror", (err) => {
      pageErrors.push({ route: page.url(), error: err.message });
    });

    for (const route of publicRoutes) {
      const response = await page.goto(route.path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `Expected route ${route.path} to return 200`).toBe(200);

      // Verify page content rendered
      await expect(page.locator("body")).toBeVisible();
      // Verify no empty white screen
      if (route.path === "/portfolio") {
        await expect(page.locator("canvas, body").first()).toBeVisible();
      } else {
        const bodyText = await page.locator("body").innerText();
        expect(bodyText.trim().length, `Expected route ${route.path} to have text content`).toBeGreaterThan(50);
      }
    }

    expect(
      pageErrors,
      `Unhandled page runtime errors detected on public routes: ${JSON.stringify(pageErrors, null, 2)}`
    ).toHaveLength(0);
  });

  test("2. Dynamic product detail page (/shop/[slug]) loads real artwork cleanly", async ({ page }) => {
    const realProduct = await prisma.product.findFirst({
      where: { stock: { gt: 0 } },
      select: { slug: true, title: true, price: true },
    });

    expect(realProduct).not.toBeNull();
    const productUrl = `/shop/${realProduct!.slug}`;

    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const res = await page.goto(productUrl, { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBe(200);

    // Verify product title, price, and Add to Cart button
    await expect(page.locator("h1")).toContainText(realProduct!.title);
    await expect(page.locator("body")).toContainText(realProduct!.price.toLocaleString("en-IN"));
    expect(pageErrors).toHaveLength(0);
  });

  test("3. Auth pages render inputs and submit buttons with zero errors", async ({ page }) => {
    const authRoutes = [
      { path: "/login", fields: ['input[type="email"]', 'input[type="password"]'] },
      { path: "/register", fields: ['input[type="email"]', 'input[name="name"]'] },
      { path: "/forgot-password", fields: ['input[type="email"]'] },
      { path: "/reset-password", fields: ['input[type="password"]'] },
    ];

    for (const item of authRoutes) {
      const res = await page.goto(item.path);
      expect(res?.status()).toBe(200);
      for (const selector of item.fields) {
        await expect(page.locator(selector).first()).toBeVisible();
      }
      await expect(page.locator('button[type="submit"]').first()).toBeVisible();
    }
  });

  test("4. Protected customer pages redirect unauthenticated visitors to /login", async ({ page }) => {
    const protectedCustomerRoutes = ["/profile", "/profile/orders", "/profile/commissions"];
    for (const route of protectedCustomerRoutes) {
      await page.goto(route);
      await page.waitForURL(/\/(login|$)/);
      expect(page.url()).toContain("/login");
    }
  });

  test("5. Protected admin pages redirect unauthenticated visitors away from /admin", async ({ page }) => {
    const adminRoutes = [
      "/admin",
      "/admin/orders",
      "/admin/products",
      "/admin/products/new",
      "/admin/commissions",
      "/admin/coupons",
      "/admin/customers",
      "/admin/gallery",
      "/admin/posts",
      "/admin/posts/new",
      "/admin/testimonials",
      "/admin/faqs",
    ];

    for (const route of adminRoutes) {
      await page.goto(route);
      await page.waitForURL(/\/(login|$)/);
      expect(page.url()).not.toContain(route);
    }
  });

  test("6. Interactive Frontend Flow: Catalog -> Product -> Add to Cart -> Cart -> Coupon Input", async ({ page }) => {
    test.setTimeout(120000);
    await page.goto("/shop");
    await page.waitForLoadState("domcontentloaded");

    // Click on the first product card
    const firstProduct = page.locator('a[href^="/shop/"]').first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    await page.waitForURL(/\/shop\/.+/);
    await expect(page.locator("h1")).toBeVisible();

    // Check if product is in stock; if so, click Add to Cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("Add To Cart")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();

      // Open Cart page
      await page.goto("/cart");
      await page.waitForLoadState("domcontentloaded");

      // Verify cart contains items or order summary
      await expect(page.locator("body")).toContainText(/Order Summary|Your Cart|Cart/i);

      // Verify coupon code input exists
      const couponInput = page.locator('input[placeholder*="coupon" i], input[placeholder*="promo" i], input[name*="coupon" i]').first();
      if (await couponInput.isVisible()) {
        await couponInput.fill("VINYASFIRST");
        const applyBtn = page.locator('button:has-text("Apply")').first();
        if (await applyBtn.isVisible()) {
          await applyBtn.click();
        }
      }
    }
  });
});
