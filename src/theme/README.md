# Vinyas Design System

Centralized theme configuration for the Vinyas project. This folder contains all design tokens, component styles, and utility functions for consistent styling across the application.

## 📁 Structure

```
src/theme/
├── index.ts          # Main theme object with all design tokens
├── components.ts     # Pre-built component style strings
├── utils.ts          # Utility functions for working with the theme
└── README.md         # This file
```

## 🎨 Usage

### 1. Using Tailwind Classes (Recommended)

The theme is integrated with Tailwind, so you can use custom classes directly:

```tsx
// Colors
<div className="bg-linen text-charcoal border-terracotta">

// Spacing
<div className="p-section gap-card-gap">

// Typography
<h1 className="text-section-heading font-display">

// Shadows (Neo-brutalist)
<button className="shadow-neo-te hover:shadow-neo-te-hover">

// Grid layouts
<div className="grid grid-cols-products gap-card-gap">
```

### 2. Using Component Styles

Pre-built component style strings for common patterns:

```tsx
import { buttonStyles, cardStyles, cn } from '@/theme/components';

// Button
<button className={buttonStyles.primary}>
  Click Me
</button>

// Product Card
<div className={cardStyles.product}>
  <div className={cardStyles.productImg}>
    {/* Image */}
  </div>
  <div className={cardStyles.productInfo}>
    {/* Info */}
  </div>
</div>

// Combine with custom classes
<button className={cn(buttonStyles.primary, 'w-full')}>
  Full Width Button
</button>
```

### 3. Using Theme Object (JavaScript)

When you need theme values in JavaScript:

```tsx
import theme from '@/theme';

// Get colors
const bgColor = theme.colors.linen;
const accentColor = theme.colors.terracotta.DEFAULT;

// Get spacing
const sectionPadding = theme.spacing.section; // '64px'

// Get shadows
const shadow = theme.shadows.neoTe; // '4px 4px 0 #C17B5C'
```

### 4. Using Utility Functions

Helper functions for common patterns:

```tsx
import { cn, neoHover, artBg, typography } from '@/theme/utils';

// Combine class names
<div className={cn(
  'base-class',
  isActive && 'active-class',
  'another-class'
)}>

// Neo-brutalist hover effect
<button className={cn('btn-base', neoHover('te'))}>

// Art background colors
<div className={artBg('warm')}>

// Typography presets
<h1 className={typography.heading}>
```

## 🎯 Design Tokens

### Colors

| Token             | Value     | Usage                 |
| ----------------- | --------- | --------------------- |
| `linen`           | `#F0EBE3` | Primary background    |
| `charcoal`        | `#2D2D2D` | Primary text, borders |
| `terracotta`      | `#C17B5C` | Primary accent        |
| `terracotta-pale` | `#E8C4B0` | Soft backgrounds      |
| `terracotta-dark` | `#9A5C40` | Hover states          |
| `moss`            | `#7B9E87` | Secondary accent      |
| `blush`           | `#D4A5A5` | Decorative            |
| `deep`            | `#1C1410` | Dark sections         |

### Spacing

| Token        | Value  | Usage                 |
| ------------ | ------ | --------------------- |
| `section`    | `64px` | Section padding       |
| `section-sm` | `48px` | Small section padding |
| `card-gap`   | `16px` | Gap between cards     |
| `nav-height` | `56px` | Navigation bar height |

### Typography

| Token                  | Size                     | Usage            |
| ---------------------- | ------------------------ | ---------------- |
| `text-hero`            | `clamp(52px, 7vw, 84px)` | Hero headlines   |
| `text-section-heading` | `40px`                   | Section headings |
| `text-page-header`     | `48px`                   | Page headers     |
| `text-body`            | `12.5px`                 | Body text        |
| `text-label`           | `9.5px`                  | Labels, tags     |
| `text-nav-link`        | `10px`                   | Navigation links |

### Shadows (Neo-Brutalist)

| Token                 | Value               | Usage                     |
| --------------------- | ------------------- | ------------------------- |
| `shadow-neo-te`       | `4px 4px 0 #C17B5C` | Default terracotta shadow |
| `shadow-neo-te-hover` | `2px 2px 0 #C17B5C` | Hover state               |
| `shadow-neo-ch`       | `4px 4px 0 #2D2D2D` | Charcoal shadow           |
| `shadow-neo-dp`       | `4px 4px 0 #1C1410` | Deep brown shadow         |

## 🧩 Component Styles

### Buttons

```tsx
import { buttonStyles } from '@/theme/components';

// Primary (charcoal with terracotta shadow)
<button className={buttonStyles.primary}>Primary</button>

// Outline
<button className={buttonStyles.outline}>Outline</button>

// Linen (for dark backgrounds)
<button className={buttonStyles.linen}>Linen</button>

// CTA (terracotta)
<button className={buttonStyles.cta}>CTA</button>
```

### Cards

```tsx
import { cardStyles } from '@/theme/components';

// Product card
<div className={cardStyles.product}>
  <div className={cardStyles.productImg}>...</div>
  <div className={cardStyles.productInfo}>...</div>
</div>

// Journal card
<div className={cardStyles.journal}>
  <div className={cardStyles.journalCover}>...</div>
  <div className={cardStyles.journalBody}>...</div>
</div>
```

### Badges

```tsx
import { badgeStyles } from '@/theme/components';

// Product badge
<span className={badgeStyles.product}>New</span>

// Sale badge
<span className={badgeStyles.sale}>Sale</span>

// Sold stamp
<div className={badgeStyles.sold}>Sold</div>

// Tag
<span className={badgeStyles.tag}>Watercolour</span>
```

### Forms

```tsx
import { formStyles } from '@/theme/components';

// Input field
<input className={formStyles.field} />

// Textarea
<textarea className={formStyles.textarea} />

// Label
<label className={formStyles.label}>Label</label>
```

## 📐 Layout Patterns

### Grid Layouts

```tsx
// Hero split (58% / 42%)
<div className="grid grid-cols-hero">

// Product grid (1.45fr 1fr 1fr)
<div className="grid grid-cols-products gap-card-gap">

// About strip (3 equal columns)
<div className="grid grid-cols-about">

// Journal grid (1.6fr 1fr)
<div className="grid grid-cols-journal gap-card-gap">

// Commission split (1fr 1fr)
<div className="grid grid-cols-commission">

// Cart layout (main + sidebar)
<div className="grid grid-cols-cart">
```

## 🎭 Animations

### Scroll Reveal

```tsx
import { animationStyles } from '@/theme/components';

<div className={animationStyles.reveal}>
  {/* Content fades in and slides up when visible */}
</div>;
```

### Pulsing Pip

```tsx
<div className={animationStyles.pip} />
```

### Marquee

```tsx
<div className="overflow-hidden">
  <div className={animationStyles.marquee}>
    {/* Content scrolls infinitely */}
  </div>
</div>
```

## 🔧 Utility Functions

### Combine Class Names

```tsx
import { cn } from '@/theme/utils';

const className = cn(
  'base-class',
  isActive && 'active-class',
  isPrimary ? 'primary' : 'secondary',
  'final-class',
);
```

### Neo-Brutalist Hover

```tsx
import { neoHover } from '@/theme/utils';

<button className={cn('btn-base', neoHover('te'))}>
  {/* Adds translate and shadow transition on hover */}
</button>;
```

### Typography Presets

```tsx
import { typography } from '@/theme/utils';

<h1 className={typography.heading}>
  Heading with <em>italic</em> support
</h1>;
```

## 📱 Responsive Design

The theme includes responsive breakpoints:

- **Mobile**: `768px` and below
- **Tablet**: `1024px` and below
- **Desktop**: `1280px` and above

Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-products">
```

## 🎨 Design Principles

### Neo-Brutalism

- **No rounded corners** - All elements use `border-radius: 0`
- **Offset shadows** - `4px 4px 0` shadows that move on hover
- **Bold borders** - `1.5px` solid borders
- **Flat colors** - No gradients

### Typography Hierarchy

- **Display**: Playfair Display (serif) for headings
- **Body**: Nunito (sans-serif) for text
- **Ghost**: Syne (sans-serif) for large background text

### Color Usage

- **Light sections**: Linen background, charcoal text, terracotta accents
- **Dark sections**: Deep background, linen text, terracotta accents
- **Never use pure black or white** - Always use charcoal and linen

## 🚀 Best Practices

1. **Use Tailwind classes first** - They're optimized and tree-shakeable
2. **Use component styles for complex patterns** - Reduces duplication
3. **Use theme object for JavaScript logic** - When you need values in JS
4. **Use utility functions for dynamic classes** - `cn()`, `neoHover()`, etc.
5. **Keep custom CSS minimal** - Prefer theme tokens over one-off values

## 📝 Adding New Tokens

To add new design tokens:

1. **Update `tailwind.config.ts`** - Add to the `extend` section
2. **Update `src/theme/index.ts`** - Add to the theme object
3. **Update this README** - Document the new token

Example:

```ts
// tailwind.config.ts
extend: {
  colors: {
    'new-color': '#123456',
  },
}

// src/theme/index.ts
colors: {
  newColor: '#123456',
}
```

## 🐛 Troubleshooting

### Classes not working?

1. Check if the class is defined in `tailwind.config.ts`
2. Restart the dev server after config changes
3. Check for typos in class names

### Styles not applying?

1. Check CSS specificity - Tailwind classes have low specificity
2. Use `!important` sparingly with `!` prefix: `!bg-linen`
3. Check if global CSS is overriding

### TypeScript errors?

1. Ensure `src/theme/index.ts` exports are correct
2. Check import paths: `@/theme` or `@/theme/components`
3. Restart TypeScript server in VS Code

---

**Need help?** Check the design system documentation in `Desgins/Vinyas-design-system.md`
