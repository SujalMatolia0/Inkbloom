/**
 * Theme utility functions
 * Helper functions for working with the design system
 */

import { theme } from './index';

/**
 * Get a color value from the theme
 */
export const getColor = (colorPath: string): string => {
  const keys = colorPath.split('.');
  let value: any = theme.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return '';
  }
  
  return typeof value === 'string' ? value : value.DEFAULT || '';
};

/**
 * Get a spacing value from the theme
 */
export const getSpacing = (key: keyof typeof theme.spacing): string => {
  return theme.spacing[key] || '';
};

/**
 * Get a shadow value from the theme
 */
export const getShadow = (key: keyof typeof theme.shadows): string => {
  return theme.shadows[key] || '';
};

/**
 * Combine class names (simple version)
 * For more complex needs, consider using 'clsx' or 'classnames' library
 */
export const cn = (...classes: (string | undefined | null | false | 0)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Generate responsive class names
 */
export const responsive = (
  base: string,
  tablet?: string,
  mobile?: string
): string => {
  const classes = [base];
  if (tablet) classes.push(`md:${tablet}`);
  if (mobile) classes.push(`sm:${mobile}`);
  return classes.join(' ');
};

/**
 * Neo-brutalist button hover effect
 * Returns the transform and shadow classes for the hover state
 */
export const neoHover = (shadowColor: 'te' | 'ch' | 'dp' = 'te'): string => {
  return `hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-neo-${shadowColor}-hover`;
};

/**
 * Product card hover effect
 */
export const productCardHover = (): string => {
  return 'hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-neo-te-lg';
};

/**
 * Generate opacity class
 */
export const opacity = (value: number): string => {
  return `opacity-${Math.round(value * 100)}`;
};

/**
 * Generate border class with charcoal color
 */
export const border = (width: '1' | '1.5' | '2' | '2.5' = '1.5'): string => {
  return `border-${width} border-charcoal`;
};

/**
 * Generate border class for dark backgrounds
 */
export const borderDark = (opacity: number = 0.1): string => {
  return `border border-linen/${Math.round(opacity * 100)}`;
};

/**
 * Typography preset classes
 */
export const typography = {
  // Display text
  display: 'font-display font-bold',
  
  // Body text
  body: 'font-body',
  
  // Ghost background text
  ghost: 'font-ghost font-extrabold',
  
  // Uppercase label
  label: 'uppercase tracking-[0.14em] font-bold',
  
  // Section heading with italic support
  heading: 'font-display font-bold [&_em]:italic [&_em]:text-terracotta',
};

/**
 * Layout preset classes
 */
export const layout = {
  // Center content
  center: 'flex items-center justify-center',
  
  // Flex column
  column: 'flex flex-col',
  
  // Flex row with gap
  row: (gap: string = 'gap-4') => `flex items-center ${gap}`,
  
  // Grid with gap
  grid: (cols: number, gap: string = 'gap-4') => `grid grid-cols-${cols} ${gap}`,
  
  // Absolute center
  absoluteCenter: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  
  // Full size
  full: 'w-full h-full',
};

/**
 * Transition preset classes
 */
export const transition = {
  fast: 'transition-all duration-fast',
  med: 'transition-all duration-med',
  slow: 'transition-all duration-slow',
  colors: 'transition-colors duration-fast',
  transform: 'transition-transform duration-fast',
  shadow: 'transition-shadow duration-fast',
  all: 'transition-all duration-fast',
};

/**
 * Cursor preset classes
 */
export const cursor = {
  none: 'cursor-none',
  pointer: 'cursor-pointer',
  default: 'cursor-default',
};

/**
 * Z-index preset classes
 */
export const zIndex = {
  cursor: 'z-cursor',
  cursorRing: 'z-cursor-ring',
  nav: 'z-nav',
  mobileNav: 'z-mobile-nav',
  modal: 'z-modal',
};

/**
 * Common component patterns
 */
export const patterns = {
  // Neo-brutalist card
  neoCard: 'border-1.5 border-charcoal bg-linen transition-all duration-[220ms]',
  
  // Dark section
  darkSection: 'bg-deep text-linen border-t border-charcoal',
  
  // Light section
  lightSection: 'bg-linen text-charcoal border-b border-charcoal',
  
  // Terracotta section
  terracottaSection: 'bg-terracotta text-linen',
  
  // Ghost background text
  ghostBg: 'absolute font-ghost text-ghost font-extrabold text-transparent [-webkit-text-stroke:1px_rgba(45,45,45,0.055)] pointer-events-none select-none',
  
  // Ruled lines background
  ruledBg: 'absolute inset-0 pointer-events-none opacity-4',
  
  // Dark grid background
  darkGrid: 'absolute inset-0 pointer-events-none [background-image:linear-gradient(rgba(240,235,227,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(240,235,227,0.03)_1px,transparent_1px)] [background-size:40px_40px]',
};

/**
 * Responsive breakpoint helpers
 */
export const breakpoints = {
  mobile: `@media (max-width: ${theme.breakpoints.mobile})`,
  tablet: `@media (max-width: ${theme.breakpoints.tablet})`,
  desktop: `@media (min-width: ${theme.breakpoints.desktop})`,
};

/**
 * Generate art background color class
 */
export const artBg = (variant: 'warm' | 'cool' | 'blush' | 'sand' | 'green' | 'pale'): string => {
  return `bg-art-${variant}`;
};

export default {
  getColor,
  getSpacing,
  getShadow,
  cn,
  responsive,
  neoHover,
  productCardHover,
  opacity,
  border,
  borderDark,
  typography,
  layout,
  transition,
  cursor,
  zIndex,
  patterns,
  breakpoints,
  artBg,
};
