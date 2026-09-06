# Vinyas Theme - Quick Reference

## 🎨 Colors

```tsx
// Backgrounds
bg - linen; // #F0EBE3 - Primary background
bg - deep; // #1C1410 - Dark sections
bg - terracotta; // #C17B5C - Accent sections

// Text
text - charcoal; // #2D2D2D - Primary text
text - linen; // #F0EBE3 - Text on dark backgrounds
text - terracotta; // #C17B5C - Accent text

// Borders
border - charcoal; // #2D2D2D
border - terracotta; // #C17B5C

// Art Backgrounds
bg - art - warm; // #E2B8A0
bg - art - cool; // #C8DAD0
bg - art - blush; // #E8D0D0
bg - art - sand; // #E4DDD4
```

## 📏 Spacing

```tsx
p - section; // 64px padding
p - section - sm; // 48px padding
gap - card - gap; // 16px gap
h - nav - height; // 56px height
```

## 🔤 Typography

```tsx
// Fonts
font - display; // Playfair Display (headings)
font - body; // Nunito (body text)
font - ghost; // Syne (background text)

// Sizes
text - hero; // Hero headlines
text - section - heading; // Section headings
text - page - header; // Page headers
text - body; // Body text
text - label; // Labels/tags
text - nav - link; // Navigation
text - btn; // Buttons
```

## 🎭 Shadows (Neo-Brutalist)

```tsx
shadow - neo - te; // 4px 4px 0 terracotta
shadow - neo - te - hover; // 2px 2px 0 terracotta (hover)
shadow - neo - ch; // 4px 4px 0 charcoal
shadow - neo - dp; // 4px 4px 0 deep
```

## 🔘 Buttons

```tsx
import { buttonStyles } from '@/theme/components';

<button className={buttonStyles.primary}>Primary</button>
<button className={buttonStyles.outline}>Outline</button>
<button className={buttonStyles.linen}>Linen</button>
<button className={buttonStyles.cta}>CTA</button>
```

## 🃏 Cards

```tsx
import { cardStyles } from '@/theme/components';

// Product Card
<div className={cardStyles.product}>
  <div className={cardStyles.productImg}>...</div>
  <div className={cardStyles.productInfo}>...</div>
</div>

// Journal Card
<div className={cardStyles.journal}>
  <div className={cardStyles.journalCover}>...</div>
  <div className={cardStyles.journalBody}>...</div>
</div>
```

## 🏷️ Badges

```tsx
import { badgeStyles } from '@/theme/components';

<span className={badgeStyles.product}>New</span>
<span className={badgeStyles.sale}>Sale</span>
<div className={badgeStyles.sold}>Sold</div>
<span className={badgeStyles.tag}>Tag</span>
```

## 📐 Layouts

```tsx
// Grids
grid grid-cols-hero          // 58% / 42% split
grid grid-cols-products      // 1.45fr 1fr 1fr
grid grid-cols-about         // 3 equal columns
grid grid-cols-journal       // 1.6fr 1fr
grid grid-cols-commission    // 1fr 1fr
grid grid-cols-cart          // main + 380px sidebar
```

## 🎬 Animations

```tsx
import { animationStyles } from '@/theme/components';

<div className={animationStyles.reveal}>Fade in on scroll</div>
<div className={animationStyles.pip}>Pulsing dot</div>
<div className={animationStyles.marquee}>Infinite scroll</div>
```

## 🛠️ Utilities

```tsx
import { cn, neoHover, artBg } from '@/theme/utils';

// Combine classes
const className = cn(
  'base-class',
  isActive && 'active-class'
);

// Neo hover effect
<button className={cn('btn', neoHover('te'))}>

// Art background
<div className={artBg('warm')}>
```

## 📱 Responsive

```tsx
// Mobile-first approach
<div className="
  grid-cols-1           // Mobile
  md:grid-cols-2        // Tablet (1024px+)
  lg:grid-cols-products // Desktop (1280px+)
">
```

## 🎯 Common Patterns

### Hero Section

```tsx
<div className="h-[calc(100vh-59px)] flex flex-col overflow-hidden">
  <div className="relative flex-1 grid grid-cols-hero overflow-hidden">
    {/* Left side */}
    {/* Right side */}
  </div>
</div>
```

### Section Header

```tsx
<div className="flex justify-between items-end mb-component-gap">
  <div>
    <div className="text-label uppercase tracking-[0.18em] text-terracotta mb-[10px]">
      Label
    </div>
    <h2 className="font-display text-section-heading font-bold">
      Heading <em className="italic text-terracotta">accent</em>
    </h2>
  </div>
  <a className="text-nav-link uppercase tracking-[0.14em] border-b-1.5 border-terracotta">
    View all →
  </a>
</div>
```

### Product Card

```tsx
<div className="border-1.5 border-charcoal bg-linen cursor-none relative overflow-hidden transition-all duration-[220ms] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-neo-te-lg">
  <div className="w-full aspect-product flex items-center justify-center relative">
    {/* Image */}
  </div>
  <div className="p-[13px_15px] border-t-1.5 border-charcoal flex justify-between items-center">
    <div>
      <div className="font-display text-product-name font-bold">Name</div>
      <div className="text-product-meta opacity-45">Meta</div>
    </div>
    <div className="text-product-price font-bold text-terracotta">₹8,400</div>
  </div>
</div>
```

### Dark Section

```tsx
<section className="bg-deep text-linen p-section border-t border-charcoal">
  {/* Content */}
</section>
```

### Form Field (on terracotta bg)

```tsx
<input
  className="w-full bg-linen/15 border border-linen/40 px-[14px] py-[11px] text-[12px] text-linen outline-none transition-all duration-fast focus:bg-linen/[0.22] focus:border-linen/65 placeholder:text-linen/50"
  placeholder="Your name"
/>
```

## 🎨 Design Rules

1. **No rounded corners** - Always use `rounded-none` or omit
2. **Neo-brutalist shadows** - Offset shadows that move on hover
3. **Bold borders** - Use `border-1.5` (1.5px)
4. **Flat colors** - No gradients
5. **Cursor none** - Add `cursor-none` to interactive elements
6. **Uppercase labels** - Use `uppercase tracking-[0.14em]`
7. **Italic accents** - Use `<em>` for terracotta italic text in headings

## 🚀 Quick Start

```tsx
// 1. Import what you need
import { buttonStyles, cardStyles, cn } from '@/theme/components';
import { neoHover, artBg } from '@/theme/utils';

// 2. Use pre-built styles
<button className={buttonStyles.primary}>Click Me</button>

// 3. Or use Tailwind classes
<div className="bg-linen text-charcoal p-section">
  <h1 className="font-display text-section-heading">
    Hello <em className="italic text-terracotta">World</em>
  </h1>
</div>

// 4. Combine with utilities
<button className={cn(
  buttonStyles.primary,
  'w-full',
  neoHover('te')
)}>
  Full Width Button
</button>
```

---

**Pro Tip**: Use VS Code's IntelliSense - type `className="` and press `Ctrl+Space` to see all available classes!
