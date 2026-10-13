# Vinyas Studio: Pre-Launch Plan & Checklist

Work through the phases in order. Items marked **(BLOCKER)** must be done before launch.

## Go / No-Go Rule

If Phases 1 to 3 aren't finished, you can still launch as a **showcase plus commission and WhatsApp enquiry site** with checkout switched off. Don't take real payments until the payment checks in Phase 1 pass.

---

## Phase 0: Facts only Anki can confirm

- [ ] **(BLOCKER)** Real stats (commissions, artworks, rating, years) in `site.ts`, or remove the ones you can't prove
- [ ] **(BLOCKER)** Real prices for resin, murals, portraits, murti and canvas/gifts, and what each includes
- [ ] **(BLOCKER)** A real email you control (not `inkbloom.com` unless you own it), also used as the grievance contact
- [ ] **(BLOCKER)** A real postal address (not "Main Town") and studio hours
- [ ] Real social links (Instagram handle, Pinterest) and correct WhatsApp number format
- [ ] Policy decisions made:
  - [ ] Transit insurance: yes or no, and on which orders
  - [ ] Free-shipping threshold confirmed
  - [ ] International shipping: yes, no, or on request
  - [ ] 7-day returns on original artworks: yes or no
  - [ ] Damage handling: replace, repair or refund
  - [ ] Deposit refund rules
  - [ ] Whether the first sketch is free or after the deposit
- [ ] **(BLOCKER)** Sample testimonials deleted or clearly labelled as samples
- [ ] Stock resin hero photo replaced with a real photo
- [ ] Confirm what is actually integrated: Razorpay, Cloudinary, Supabase, Vercel

---

## Phase 1: Payments & Security

### Server-side pricing

- [ ] **(BLOCKER)** Order total is computed on the server from database prices; the client sends only product IDs and quantities
- [ ] **(BLOCKER)** Coupons validated and applied on the server (active, not expired, minimum order, `maxDiscount`)
- [ ] Coupon usage limit and per-customer limit added to the schema
- [ ] Coupon validation endpoint rate-limited (stops code guessing)
- [ ] **(BLOCKER)** Stock decremented atomically in a transaction; quantity capped at stock
- [ ] Money stored as `Decimal` or integer paise, not `Float`

### Razorpay

- [ ] **(BLOCKER)** `razorpayOrderId` saved on the order; verify looks up the order and checks the amount
- [ ] **(BLOCKER)** Verify is idempotent (the same payment can't pay twice or pay a different order)
- [ ] Webhook (`payment.captured`) added with signature check
- [ ] Production uses **live** keys; preview and local use **test** keys
- [ ] Duplicate legacy routes (`/api/create-order`, `/api/verify-payment`) deleted or identical in protection

### Auth & access

- [ ] **(BLOCKER)** Every admin page, API route and server action checks `role === "ADMIN"` (not just the layout)
- [ ] Login by lowercase email only (no login by name)
- [ ] `authorize` returns only `{ id, email, name, role }`, never the password hash or reset token
- [ ] Rate limit or lockout on login
- [ ] Email verification on register
- [ ] Register endpoint can't accept a `role` field
- [ ] Reset tokens stored hashed, expiring and single-use
- [ ] **(BLOCKER)** IDOR test passed: user A cannot open user B's orders or commissions

### Infrastructure

- [ ] **(BLOCKER)** Rate limiting works on Vercel (Redis or DB-backed, not in-memory)
- [ ] Database SSL uses the proper certificate (not `rejectUnauthorized: false`)
- [ ] App uses the **pooled** Supabase connection string; direct URL used only for migrations
- [ ] User text shown in the admin dashboard is escaped (no stored XSS)
- [ ] User text in emails is escaped
- [ ] `npm audit` reviewed
- [ ] No secrets in git history or in the client bundle (`grep -r "SECRET" .next/static`)

---

## Phase 2: Forms, Uploads & Email

- [ ] Commission form works end to end:
  - [ ] with no photo
  - [ ] with a small photo
  - [ ] with a large photo
  - [ ] when the upload fails (nothing saved)
- [ ] **(BLOCKER)** Upload size limit is real and matches Next.js and Vercel body limits (compress client-side or upload directly)
- [ ] **(BLOCKER)** Reference photos are private (opening the stored URL in a private window fails)
- [ ] Honeypot checked server-side as well as in the browser
- [ ] Consent and structured fields (phone, service, size, budget) saved in the database
- [ ] Both emails (studio alert and customer confirmation) arrive in the inbox, not spam
- [ ] Customer confirmation can't be abused to email strangers (rate limit per email and IP)
- [ ] Email failures are logged and visible, and don't break the customer's success message
- [ ] Gmail app password added to Vercel env vars and the site redeployed

---

## Phase 3: Content & Legal

- [ ] Shipping, Returns, Terms, Privacy and FAQ say exactly what you do, and nothing more
- [ ] **(BLOCKER)** No contradictions across pages (location, quote time, turnaround, deposit, refunds), all sourced from `site.ts`
- [ ] Terms cover: deposit, liability limits, right to refuse a commission, client rights to uploaded photos, effective date
- [ ] Privacy lists real processors, retention period, deletion requests, and a named grievance contact
- [ ] A lawyer or CA has reviewed the policies
- [ ] GST status settled
- [ ] E-commerce disclosure details shown (legal name, address, contact, grievance officer)
- [ ] **(BLOCKER)** No placeholder text, fake counters ("3 slots left") or invented reviews anywhere

---

## Phase 4: Environment & Deployment

- [ ] All env vars set in Vercel for **Production** (and Preview where needed):
  - [ ] `DATABASE_URL`
  - [ ] `NEXTAUTH_URL` (final domain)
  - [ ] `NEXTAUTH_SECRET`
  - [ ] Razorpay keys
  - [ ] Cloudinary keys
  - [ ] SMTP settings
- [ ] Separate production database from development
- [ ] Database migrations applied
- [ ] Backups enabled and a restore tested
- [ ] Admin account seeded with a strong password; test and default accounts removed
- [ ] Custom domain connected with HTTPS; `www` and non-`www` redirect properly
- [ ] `next.config` has image hosts, upload size limit and security headers

---

## Phase 5: Testing on a Vercel Preview

- [ ] `npm run lint` passes
- [ ] `npm run build` passes
- [ ] Full purchase in Razorpay **test mode**: success, failure, cancelled, and closed-tab cases
- [ ] Two browser tabs buying the last item
- [ ] Double-click on checkout; refresh after payment
- [ ] Price-tamper test (edit the amount in the request)
- [ ] Payment replay test (reuse a valid payment on another order)
- [ ] Role escalation test (logged-in customer hitting `/admin` and `/api/admin/*`)
- [ ] Register with an extra `"role": "ADMIN"` field is rejected
- [ ] Login burst test (50 wrong passwords gets blocked)
- [ ] Every nav, footer and CTA link checked (no 404s)
- [ ] Tested on a real phone, plus Safari, Chrome and Firefox
- [ ] WhatsApp button doesn't cover form buttons or the cart on small screens
- [ ] Keyboard-only run through the commission form and checkout

---

## Phase 6: SEO, Performance & Accessibility

- [ ] Unique title and description on every page
- [ ] Open Graph images set so links preview well on WhatsApp and Instagram
- [ ] `sitemap.xml` includes products and journal posts
- [ ] `robots.txt` blocks `/cart`, `/checkout`, `/login`, `/admin`
- [ ] Lighthouse mobile run and main issues fixed
- [ ] Image sizes fixed (no 3840px loads)
- [ ] 3D gallery has a non-3D fallback
- [ ] Colour contrast, focus states and alt text checked
- [ ] Analytics installed
- [ ] Custom 404 page works
- [ ] Security headers checked on the deployed URL

---

## Phase 7: Launch Day

- [ ] Final backup taken
- [ ] Rollback plan known (promote a previous Vercel deployment)
- [ ] Deploy to production
- [ ] Repeat key tests on the **live domain**
- [ ] One real small-value payment made, then refunded
- [ ] Sitemap submitted in Google Search Console
- [ ] Vercel logs and studio inbox watched during the first hours
- [ ] Announce only after the live test passes

---

## Phase 8: First Two Weeks

- [ ] Check logs and errors daily (failed emails, failed payments)
- [ ] Reconcile every order against the Razorpay dashboard
- [ ] Reply to every enquiry within the promised 24–48 hours
- [ ] Collect **real** reviews with permission, then replace any samples
- [ ] Review analytics and fix the top drop-off pages
- [ ] Keep `site.ts` as the single place to update facts
