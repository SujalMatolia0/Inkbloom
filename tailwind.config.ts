import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── COLORS ───
      colors: {
        linen: {
          DEFAULT: '#F0EBE3',
        },
        charcoal: {
          DEFAULT: '#2D2D2D',
        },
        terracotta: {
          DEFAULT: '#C17B5C',
          pale: '#E8C4B0',
          dark: '#9A5C40',
        },
        moss: {
          DEFAULT: '#7B9E87',
        },
        blush: {
          DEFAULT: '#D4A5A5',
        },
        deep: {
          DEFAULT: '#1C1410',
          2: '#241810',
        },
        // Art background colors
        art: {
          warm: '#E2B8A0',
          cool: '#C8DAD0',
          blush: '#E8D0D0',
          sand: '#E4DDD4',
          green: '#D0E4D8',
          pale: '#EDE4D9',
        },
      },

      // ─── TYPOGRAPHY ───
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-nunito)', 'Nunito', 'sans-serif'],
        ghost: ['var(--font-syne)', 'Syne', 'sans-serif'],
      },
      fontSize: {
        // Hero & Display
        'hero': ['clamp(52px, 7vw, 84px)', { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'hero-sm': ['48px', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        
        // Section Headings
        'section-heading': ['40px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'section-heading-sm': ['36px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section-heading-xs': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        
        // Page Headers
        'page-header': ['48px', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'page-header-sm': ['44px', { lineHeight: '1', letterSpacing: '-0.03em' }],
        
        // Stats & Numbers
        'stat-number': ['26px', { lineHeight: '1', fontWeight: '700' }],
        'stat-number-lg': ['30px', { lineHeight: '1', fontWeight: '700' }],
        'stat-number-xl': ['56px', { lineHeight: '1', fontWeight: '700' }],
        
        // Body Text
        'body': ['12.5px', { lineHeight: '1.75' }],
        'body-sm': ['12px', { lineHeight: '1.65' }],
        'body-lg': ['13px', { lineHeight: '1.75' }],
        
        // Labels & Tags
        'label': ['9.5px', { lineHeight: '1', letterSpacing: '0.18em', fontWeight: '700' }],
        'label-sm': ['9px', { lineHeight: '1', letterSpacing: '0.22em', fontWeight: '700' }],
        'label-xs': ['8px', { lineHeight: '1', letterSpacing: '0.12em', fontWeight: '700' }],
        
        // Navigation
        'nav-link': ['10px', { lineHeight: '1', letterSpacing: '0.14em', fontWeight: '700' }],
        
        // Product Cards
        'product-name': ['14px', { lineHeight: '1.2', fontWeight: '700' }],
        'product-meta': ['10px', { lineHeight: '1.5' }],
        'product-price': ['13px', { lineHeight: '1', fontWeight: '700' }],
        
        // Journal Cards
        'journal-title': ['16px', { lineHeight: '1.3', fontWeight: '700' }],
        'journal-title-sm': ['13px', { lineHeight: '1.3', fontWeight: '700' }],
        'journal-excerpt': ['12px', { lineHeight: '1.65' }],
        
        // Buttons
        'btn': ['10px', { lineHeight: '1', letterSpacing: '0.14em', fontWeight: '700' }],
        'btn-sm': ['9.5px', { lineHeight: '1', letterSpacing: '0.1em', fontWeight: '700' }],
        
        // Ghost Background Text
        'ghost': ['clamp(100px, 16vw, 210px)', { lineHeight: '0.88', letterSpacing: '-0.04em', fontWeight: '800' }],
        'ghost-sm': ['120px', { lineHeight: '0.88', letterSpacing: '-0.04em', fontWeight: '800' }],
        'ghost-md': ['180px', { lineHeight: '0.88', letterSpacing: '-0.04em', fontWeight: '800' }],
      },

      // ─── SPACING ───
      spacing: {
        // Section Padding
        'section': '64px',
        'section-sm': '48px',
        'section-xs': '40px',
        
        // Card Gaps
        'card-gap': '16px',
        'card-gap-sm': '14px',
        'card-gap-lg': '18px',
        
        // Navigation
        'nav-height': '56px',
        'nav-accent': '3px',
        'nav-padding-x': '48px',
        'nav-padding-x-sm': '24px',
        
        // Component Spacing
        'component-gap': '32px',
        'component-gap-sm': '24px',
        'component-gap-xs': '16px',
      },

      // ─── BOX SHADOWS (Neo-Brutalist) ───
      boxShadow: {
        // Terracotta shadows
        'neo-te': '4px 4px 0 #C17B5C',
        'neo-te-sm': '3px 3px 0 #C17B5C',
        'neo-te-lg': '5px 5px 0 #C17B5C',
        'neo-te-hover': '2px 2px 0 #C17B5C',
        
        // Charcoal shadows
        'neo-ch': '4px 4px 0 #2D2D2D',
        'neo-ch-sm': '3px 3px 0 #2D2D2D',
        'neo-ch-hover': '2px 2px 0 #2D2D2D',
        
        // Deep brown shadows
        'neo-dp': '4px 4px 0 #1C1410',
        'neo-dp-sm': '3px 3px 0 #1C1410',
        'neo-dp-hover': '2px 2px 0 #1C1410',
      },

      // ─── BORDER RADIUS ───
      borderRadius: {
        'none': '0',
        // Neo-brutalist = no rounded corners
      },

      // ─── BORDER WIDTH ───
      borderWidth: {
        DEFAULT: '1.5px',
        '0': '0',
        '1': '1px',
        '1.5': '1.5px',
        '2': '2px',
        '2.5': '2.5px',
      },

      // ─── TRANSITIONS ───
      transitionDuration: {
        'fast': '180ms',
        'med': '280ms',
        'slow': '550ms',
      },

      // ─── ANIMATIONS ───
      keyframes: {
        // Pulsing pip
        pip: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.7)' },
        },
        // Marquee scroll
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
        // Scroll reveal
        'reveal-up': {
          'from': { opacity: '0', transform: 'translateY(22px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pip': 'pip 2.2s ease-in-out infinite',
        'pip-fast': 'pip 2s ease-in-out infinite',
        'marquee': 'marquee 22s linear infinite',
        'reveal': 'reveal-up 0.55s ease forwards',
      },

      // ─── GRID TEMPLATES ───
      gridTemplateColumns: {
        // Hero split
        'hero': '58% 42%',
        
        // Product grids
        'products': '1.45fr 1fr 1fr',
        'products-2': 'repeat(2, 1fr)',
        'products-3': 'repeat(3, 1fr)',
        
        // About strip
        'about': 'repeat(3, 1fr)',
        
        // Journal grid
        'journal': '1.6fr 1fr',
        
        // Commission split
        'commission': '1fr 1fr',
        
        // Cart layout
        'cart': '1fr 380px',
        'cart-item': '80px 1fr auto auto',
      },

      // ─── ASPECT RATIOS ───
      aspectRatio: {
        'product': '1.1',
        'product-featured': '3/4.2',
        'product-tall': '0.72',
        'product-wide': '2.1',
      },

      // ─── OPACITY ───
      opacity: {
        '3': '0.03',
        '4': '0.04',
        '8': '0.08',
        '12': '0.12',
        '15': '0.15',
        '18': '0.18',
        '22': '0.22',
        '28': '0.28',
        '32': '0.32',
        '38': '0.38',
        '42': '0.42',
        '45': '0.45',
        '55': '0.55',
        '58': '0.58',
        '65': '0.65',
        '72': '0.72',
        '78': '0.78',
        '85': '0.85',
      },

      // ─── Z-INDEX ───
      zIndex: {
        'cursor': '9999',
        'cursor-ring': '9998',
        'nav': '100',
        'mobile-nav': '99',
        'modal': '200',
      },
    },
  },
  plugins: [],
};

export default config;
