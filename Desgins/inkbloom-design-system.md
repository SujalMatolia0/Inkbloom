# Inkbloom — Design System Documentation
> Version 1.0 · Dusty Studio Aesthetic · Ready for Development

---

## 1. Brand Identity

**Name:** Inkbloom  
**Tagline:** *Where ink meets blooming creativity.*  
**Domain:** inkbloom.in / inkbloom.art  
**Location:** Jaipur, Rajasthan, India  
**Concept:** A luxury art magazine that came out of a painter's studio sketchbook. Editorial smoothness + warm kawaii doodle energy.

---

## 2. Color Palette

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--li` | Linen | `#F0EBE3` | Primary background, light sections |
| `--ch` | Charcoal | `#2D2D2D` | Primary text, borders, outlines |
| `--te` | Terracotta | `#C17B5C` | Primary accent — buttons, tags, highlights, nav bar |
| `--te-pale` | Terracotta Pale | `#E8C4B0` | Soft artwork backgrounds, hover tints |
| `--te-dark` | Terracotta Dark | `#9A5C40` | Button hover states, deep accents |
| `--mo` | Moss Green | `#7B9E87` | Secondary accent — hover states, tags, price labels |
| `--bl` | Blush Pink | `#D4A5A5` | Decorative SVG fills, soft sold states |
| `--dp` | Deep Brown | `#1C1410` | Dark sections (hero right, journal, footer) |
| `--dp2` | Deep Brown 2 | `#241810` | Card backgrounds on dark sections |

### Color Rules
- **Light sections:** `--li` background, `--ch` text, `--te` accents
- **Dark sections:** `--dp` background, `--li` text, `--te` accents
- **Never** use pure black (`#000`) or pure white (`#fff`) — always use `--ch` and `--li`
- The terracotta accent bar (3px) always appears at the very top of the page
- Section dividers use `1px solid var(--ch)` on light, `1px solid rgba(240,235,227,0.1)` on dark

---

## 3. Typography

| Role | Font | Weight | Size Range | Notes |
|------|------|--------|------------|-------|
| Display / Hero | Playfair Display | 700 | 52px–88px | Italic variant for accent words |
| Subheadings | Playfair Display | 700 | 28px–42px | Use italic `em` tags for warmth |
| Ghost BG Text | Syne | 800 | 140px–220px | Transparent, `-webkit-text-stroke`, opacity ~5.5% |
| Body | Nunito | 400 | 12px–13.5px | Line-height 1.7–1.8 |
| Labels / Tags | Nunito | 700 | 8px–10px | `letter-spacing: 0.14–0.22em`, ALL CAPS |
| Prices | Nunito | 700 | 11px–13px | Color: `--te` |
| Nav Links | Nunito | 700 | 10px | `letter-spacing: 0.14em`, ALL CAPS, opacity 0.4 → 1 on active |

### Typography Patterns
```css
/* Display headline pattern */
.headline {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.04em;
}

/* Italic accent word — always terracotta */
.headline em {
  font-style: italic;
  color: var(--te);
}

/* Outline text — third line of hero headline */
.outline-text {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--ch);
}

/* Section label — above every heading */
.sec-label {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--te);
  margin-bottom: 10px;
}
```

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Syne:wght@800&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet"/>
```

---

## 4. Layout System

### Page Structure
```
┌─────────────────────────────────┐
│ 3px Terracotta Accent Bar       │  ← always pinned top
├─────────────────────────────────┤
│ 56px Nav Bar (linen bg)         │  ← sticky
├──────────────────┬──────────────┤
│                  │              │
│  Hero Left       │  Hero Right  │  ← 58% / 42% split
│  (linen)         │  (deep brown)│
│                  │              │
├─────────────────────────────────┤
│ Terracotta Marquee Strip        │
└─────────────────────────────────┘
```

### Grid Rules
- **Hero:** `grid-template-columns: 58% 42%` — hard split with 4px terracotta seam
- **About strip:** `grid-template-columns: 1fr 1fr 1fr`
- **Product grid:** `grid-template-columns: 1.45fr 1fr 1fr` — featured card spans 2 rows
- **Journal:** `grid-template-columns: 1.6fr 1fr`
- **Commission:** `grid-template-columns: 1fr 1fr`
- **Section padding:** `64px 64px` (desktop)
- **Card gap:** `16px–18px`

### The Hard Split Rule
Every major page section uses a **hard split** — two columns divided by `1px solid var(--ch)`, never a gap. One side is always darker or uses terracotta as background.

---

## 5. Component Library

### 5A. Navigation (Floating — Centered)
```
┌─────────────────────────────────────────────────┐
│ 3px ████████████████ TERRACOTTA BAR ████████████│
├──────────────────────────────────────────────────┤
│ Inkbloom    GALLERY  SHOP  COMMISSION  JOURNAL  👤│
│ (logo left) ←──── centered ────→      (icons right)
└──────────────────────────────────────────────────┘
```
- Background: `rgba(240,235,227,0.72)` with `backdrop-filter: blur(18px)`
- On scroll: opacity increases to `0.95`
- Active link: full opacity + `1.5px solid var(--te)` underline
- Max-width: `1100px`, centered with `left: 50%; transform: translateX(-50%)`

### Classic Nav (Alternative)
- Full-width sticky
- Background: `var(--li)`, `border-bottom: 1px solid var(--ch)`
- Same link and icon treatment

### 5B. Buttons

```css
/* Primary — neo-brutalist */
.btn-primary {
  background: var(--ch);
  color: var(--li);
  border: 1.5px solid var(--ch);
  padding: 11px 26px;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.14em; text-transform: uppercase;
  box-shadow: 4px 4px 0 var(--te);   /* ← signature offset shadow */
  transition: box-shadow 0.18s, transform 0.18s;
}
.btn-primary:hover {
  box-shadow: 2px 2px 0 var(--te);
  transform: translate(2px, 2px);    /* ← moves INTO the shadow */
}

/* Outline */
.btn-outline {
  background: transparent;
  color: var(--ch);
  border: 1.5px solid var(--ch);
  padding: 11px 26px;
}
.btn-outline:hover { background: var(--ch); color: var(--li); }

/* Linen (on terracotta/dark bg) */
.btn-linen {
  background: var(--li);
  color: var(--ch);
  border: 1.5px solid var(--dp);
  box-shadow: 4px 4px 0 var(--dp);
}
```

### 5C. Cards

#### Product Card
- Border: `1.5px solid var(--ch)`
- Hover: `transform: translate(-3px, -3px)` + `box-shadow: 5px 5px 0 var(--te)`
- Badge: terracotta fill, top-left absolute
- Sold stamp: red border/text, rotated -12deg, centered absolute
- Add-to-cart button: appears on hover (opacity 0 → 1), bottom-right, charcoal fill with terracotta offset shadow

#### Journal Card
- Border: `1px solid rgba(240,235,227,0.1)` on dark bg
- Hover: border-color transitions to `var(--te)`
- Cover image area fixed height (165px featured, 88px sidebar)
- Tags: terracotta outline, 8px uppercase

#### Commission Step
- Step number in a `26px × 26px` square with `1.5px solid var(--ch)` border
- Playfair Display numeral

### 5D. Tags / Badges
```css
.tag {
  font-size: 8px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  padding: 3px 9px;
  border: 1px solid var(--te);
  color: var(--te);
}

.badge {          /* filled — for "New", "Sale" etc */
  background: var(--te);
  color: var(--li);
  font-size: 8px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 4px 9px;
}
```

### 5E. Form Fields (on terracotta bg)
```css
.form-field {
  background: rgba(240,235,227,0.15);
  border: 1px solid rgba(240,235,227,0.4);
  color: var(--li);
  padding: 11px 14px;
  font-family: 'Nunito', sans-serif;
}
.form-field:focus {
  background: rgba(240,235,227,0.22);
  border-color: rgba(240,235,227,0.65);
}
```

### 5F. Marquee Strip
```css
.marquee {
  background: var(--te);
  border-top: 1px solid var(--ch);
  border-bottom: 1px solid var(--ch);
  padding: 10px 0;
  overflow: hidden; white-space: nowrap;
}
/* Items: 10px Nunito 700, letter-spacing 0.18em, ALL CAPS, linen color */
/* Separator: ✦ in rgba(28,20,16,0.5) */
/* Animation: translateX(0) → translateX(-50%) over 22s linear infinite */
```

### 5G. Sold Stamp
```css
.sold-stamp {
  border: 2.5px solid #B03030;
  color: #B03030;
  font-family: 'Playfair Display', serif;
  font-size: 15px; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
  padding: 5px 12px;
  transform: translate(-50%, -50%) rotate(-12deg);
  position: absolute; top: 50%; left: 50%;
  opacity: 0.85;
}
```

---

## 6. Background & Texture Patterns

### Ghost Typography (Hero)
```css
.bg-type {
  font-family: 'Syne', sans-serif;
  font-size: clamp(100px, 16vw, 210px);
  font-weight: 800;
  color: transparent;
  -webkit-text-stroke: 1px rgba(45,45,45,0.055);
  letter-spacing: -0.04em;
  line-height: 0.88;
  /* Position: absolute, top-left, z-index 0 */
}
```

### Sketchbook Ruled Lines (Light sections)
```html
<svg class="ruled" viewBox="0 0 800 700" preserveAspectRatio="none">
  <!-- horizontal lines every 80px, stroke #2D2D2D, stroke-width 1, opacity 0.04 -->
</svg>
```

### Dark Grid (Dark sections)
```css
background-image:
  linear-gradient(rgba(240,235,227,.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(240,235,227,.03) 1px, transparent 1px);
background-size: 40px 40px;
```

### Terracotta Vertical Seam (Hero split)
```css
.terra-line {
  position: absolute;
  right: 42%; top: 0; bottom: 0;
  width: 4px;
  background: var(--te);
  z-index: 3;
}
```

### Doodle Floaters
- Small SVG geometric shapes (circles, leaf forms, diamond lattices)
- Opacity: `0.08–0.15`
- Colors: `var(--te)`, `var(--mo)`, `var(--ch)`
- Positioned in corners, rotated slightly
- Used as: section decorators, empty state fillers, background texture

---

## 7. Animation Patterns

### Scroll Reveal
```css
.reveal {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
```
```js
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
```

### Pulsing Pip (Active / Live indicators)
```css
@keyframes pip {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(1.7); }
}
/* Usage: 6–7px circle, background: var(--te), animation: pip 2.2s ease-in-out infinite */
```

### Button Press (Neo-brutalist)
```css
/* On hover: move 2px down-right, reduce shadow by 2px */
transform: translate(2px, 2px);
box-shadow: 2px 2px 0 var(--te); /* was 4px 4px */
```

### Custom Cursor
```js
// Two elements: 9px dot (fast) + 34px ring (lagged)
// Dot: follows mouse instantly
// Ring: lerps at 0.11 speed each frame
// On hover interactive elements: dot shrinks, ring expands
```

### Card Hover
```css
.card:hover {
  transform: translate(-3px, -3px);
  box-shadow: 5px 5px 0 var(--te);
}
/* Transition: 0.22s ease */
```

---

## 8. Page Templates

### 8A. Hero Section (100vh)
**Structure:**
```
hero-wrap (100vh, flex column)
  ├── nav-accent (3px terracotta)
  ├── nav-bar (56px)
  ├── hero (flex: 1, grid 58/42)
  │    ├── LEFT: eyebrow + headline (3 lines) + divider + body + buttons + stats
  │    └── RIGHT: dark bg + artwork stack (3 rotated cards) + gallery cta
  └── marquee (terracotta strip, ~34px)
```

**Headline Pattern:**
```
Line 1: Normal weight, linen/charcoal     → "Where"
Line 2: Italic, terracotta                → "ink"
Line 3: Outline text, transparent stroke  → "blooms."
```

### 8B. Section Pattern
Every section follows:
```
<section>
  <div class="section-header">
    <div>
      <div class="sec-label">CATEGORY LABEL</div>
      <h2 class="section-heading">Main <em>heading.</em></h2>
    </div>
    <a class="view-all">View all →</a>
  </div>
  <!-- content -->
</section>
```

### 8C. Dark Section Pattern
- Background: `var(--dp)`
- Border-top: `1px solid var(--ch)`
- All text uses `var(--li)` with reduced opacity for hierarchy
- Tags keep terracotta outline
- Cards use `rgba(240,235,227,0.03)` background with `rgba(240,235,227,0.1)` border

### 8D. Split Section Pattern (Commission style)
```
┌─────────────────┬─────────────────┐
│  Left (linen)   │  Right (terra)  │
│  border-right:  │  or dark bg     │
│  1px solid ch   │                 │
└─────────────────┴─────────────────┘
```
- Left: content, steps, description (padding 64px)
- Right: form, CTA, interactive (same padding)

---

## 9. Page-Specific Notes

### Shop Page
- Filter bar: sticky below nav, linen bg, thin bottom border
- Filter pills: outline style matching tag component
- Grid: `1.45fr 1fr 1fr` (same as homepage featured grid)
- Product count shown in Playfair Display italic
- Sorting dropdown: outline style

### Cart Page
- Slide-in drawer from right (Framer Motion)
- Dark overlay on page (`rgba(28,20,16,0.5)`)
- Cart header: `var(--ch)` background, `var(--li)` text
- Line items: linen card, product thumbnail left, info right
- Quantity: inline +/- buttons with charcoal border
- Subtotal: Playfair Display, large, terracotta price
- Checkout button: full-width `btn-primary` with terracotta shadow

### Product Detail Page
- Full-bleed image left (60%)
- Info panel right (40%): sticky scroll
- Image gallery: thumbnail strip below main image
- Price: large Playfair Display, terracotta
- "Add to Cart": full-width `btn-primary`
- "Commission Similar" link below if sold

### Commission Page
- Same split layout as homepage commission section
- Extended form: medium selector (watercolour/oil/ink/acrylic), size selector, budget range
- Status tracker: step indicator using the step-num component

### Journal / Blog
- Editorial layout: large cover, full-width title
- Reading progress bar in terracotta (fixed top)
- Post body: `max-width: 720px`, centered, Nunito 400 at 15px/1.85
- Pull quotes: Playfair Display italic, large, terracotta left border

### Admin Panel
- Dark sidebar nav (`var(--dp)`)
- Content area: `var(--li)` background
- Data tables: thin borders, terracotta row hover
- Status badges: filled colored pills

---

## 10. CSS Variables — Full Token Set

```css
:root {
  /* Colors */
  --li:      #F0EBE3;
  --ch:      #2D2D2D;
  --te:      #C17B5C;
  --te-pale: #E8C4B0;
  --te-dark: #9A5C40;
  --mo:      #7B9E87;
  --bl:      #D4A5A5;
  --dp:      #1C1410;
  --dp2:     #241810;

  /* Typography */
  --font-display: 'Playfair Display', serif;
  --font-ghost:   'Syne', sans-serif;
  --font-body:    'Nunito', sans-serif;

  /* Spacing */
  --section-pad:  64px;
  --card-gap:     16px;
  --nav-h:        56px;
  --accent-h:     3px;

  /* Borders */
  --border:       1px solid var(--ch);
  --border-dark:  1px solid rgba(240,235,227,0.1);
  --border-card:  1.5px solid var(--ch);

  /* Shadows (neo-brutalist offset) */
  --shadow-te:    4px 4px 0 var(--te);
  --shadow-ch:    4px 4px 0 var(--ch);
  --shadow-dp:    4px 4px 0 var(--dp);
  --shadow-sm-te: 3px 3px 0 var(--te);

  /* Transitions */
  --trans-fast:   0.18s ease;
  --trans-med:    0.28s ease;
  --trans-slow:   0.55s ease;
}
```

---

## 11. Do's and Don'ts

### ✅ Do
- Use `em` italic tags inside headings for terracotta accent words
- Add the 3px terracotta accent bar at the very top of every page
- Apply `reveal` class + IntersectionObserver to all cards and steps
- Use outline text (`-webkit-text-stroke`) for the third line of major headings
- Keep product card hover as translate(-3,-3) + terracotta shadow
- Separate every section with `1px solid var(--ch)` borders
- Use `sec-label` (terracotta uppercase) above every section heading
- Place doodle SVG floaters at low opacity in hero and empty state sections

### ❌ Don't
- Don't use pure black/white — use `--ch` and `--li`
- Don't use Inter, Roboto, or system fonts — always Nunito for body
- Don't use rounded corners on cards (0 border-radius)
- Don't use gradient buttons — flat with offset shadow only
- Don't use drop shadows — only the neo-brutalist offset `box-shadow`
- Don't center body text — always left-aligned
- Don't skip the `sec-label` above headings
- Don't use more than 3 font weights per page

---

## 12. Illustration / SVG Art Style

All placeholder artwork SVGs follow these rules:
- Stroke-only, no solid fills except low-opacity background washes
- Colors: `var(--te)`, `var(--mo)`, `var(--bl)`, `rgba(240,235,227,...)` on dark
- Stroke-width: 0.8–2.2px depending on importance
- Include: ink splatter circles, loose ellipses, expressive curves
- Opacity: 0.75–0.85 on light bg, 0.45–0.65 on dark bg
- Crosshatch texture lines at `stroke-width: 0.8`, opacity 0.1
- Always include a few "mistake" marks — stray dots, paint drips — for authenticity

---

*Inkbloom Design System v1.0 · Dusty Studio Aesthetic*  
*Built for Next.js + Tailwind — token names map directly to CSS custom properties*
