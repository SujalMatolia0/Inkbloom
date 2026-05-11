/**
 * Inkbloom Design System
 * Centralized theme configuration for consistent styling across the application
 */

export const theme = {
  // ─── COLORS ───
  colors: {
    linen: '#F0EBE3',
    charcoal: '#2D2D2D',
    terracotta: {
      DEFAULT: '#C17B5C',
      pale: '#E8C4B0',
      dark: '#9A5C40',
    },
    moss: '#7B9E87',
    blush: '#D4A5A5',
    deep: {
      DEFAULT: '#1C1410',
      2: '#241810',
    },
    art: {
      warm: '#E2B8A0',
      cool: '#C8DAD0',
      blush: '#E8D0D0',
      sand: '#E4DDD4',
      green: '#D0E4D8',
      pale: '#EDE4D9',
    },
  },

  // ─── SPACING ───
  spacing: {
    section: '64px',
    sectionSm: '48px',
    sectionXs: '40px',
    cardGap: '16px',
    navHeight: '56px',
    navAccent: '3px',
  },

  // ─── TYPOGRAPHY ───
  typography: {
    fontFamily: {
      display: 'var(--font-playfair), "Playfair Display", serif',
      body: 'var(--font-nunito), "Nunito", sans-serif',
      ghost: 'var(--font-syne), "Syne", sans-serif',
    },
    fontSize: {
      hero: 'clamp(52px, 7vw, 84px)',
      sectionHeading: '40px',
      pageHeader: '48px',
      statNumber: '26px',
      body: '12.5px',
      label: '9.5px',
      navLink: '10px',
      btn: '10px',
    },
  },

  // ─── SHADOWS (Neo-Brutalist) ───
  shadows: {
    neoTe: '4px 4px 0 #C17B5C',
    neoTeSm: '3px 3px 0 #C17B5C',
    neoTeLg: '5px 5px 0 #C17B5C',
    neoTeHover: '2px 2px 0 #C17B5C',
    neoCh: '4px 4px 0 #2D2D2D',
    neoChSm: '3px 3px 0 #2D2D2D',
    neoChHover: '2px 2px 0 #2D2D2D',
    neoDp: '4px 4px 0 #1C1410',
    neoDpSm: '3px 3px 0 #1C1410',
    neoDpHover: '2px 2px 0 #1C1410',
  },

  // ─── TRANSITIONS ───
  transitions: {
    fast: '180ms',
    med: '280ms',
    slow: '550ms',
  },

  // ─── BORDERS ───
  borders: {
    default: '1.5px solid #2D2D2D',
    light: '1px solid #2D2D2D',
    dark: '1px solid rgba(240,235,227,0.1)',
    dashed: '1.5px dashed #C17B5C',
  },

  // ─── GRID TEMPLATES ───
  grid: {
    hero: '58% 42%',
    products: '1.45fr 1fr 1fr',
    about: 'repeat(3, 1fr)',
    journal: '1.6fr 1fr',
    commission: '1fr 1fr',
    cart: '1fr 380px',
  },

  // ─── BREAKPOINTS ───
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1280px',
  },
} as const;

export type Theme = typeof theme;

// Helper function to get theme values in JS
export const getThemeValue = (path: string): string => {
  const keys = path.split('.');
  let value: any = theme;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return '';
  }
  
  return typeof value === 'string' ? value : '';
};

export default theme;
