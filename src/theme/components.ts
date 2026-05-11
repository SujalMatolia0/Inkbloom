/**
 * Component-specific style utilities
 * Reusable className strings for common components
 */

export const buttonStyles = {
  // Primary button (charcoal with terracotta shadow)
  primary: 'bg-charcoal text-linen border-1.5 border-charcoal px-[26px] py-[11px] font-body text-btn uppercase tracking-[0.14em] shadow-neo-te cursor-none transition-all duration-fast hover:shadow-neo-te-hover hover:translate-x-[2px] hover:translate-y-[2px] inline-flex items-center justify-center',
  
  // Outline button
  outline: 'bg-transparent text-charcoal border-1.5 border-charcoal px-[26px] py-[11px] font-body text-btn uppercase tracking-[0.14em] cursor-none transition-all duration-fast hover:bg-charcoal hover:text-linen inline-flex items-center justify-center',
  
  // Linen button (on terracotta/dark backgrounds)
  linen: 'bg-linen text-charcoal border-1.5 border-deep px-[28px] py-[12px] font-body text-btn uppercase tracking-[0.12em] shadow-neo-dp cursor-none transition-all duration-fast hover:shadow-neo-dp-hover hover:translate-x-[2px] hover:translate-y-[2px] w-full text-center block',
  
  // CTA button (terracotta)
  cta: 'bg-terracotta text-linen border-1.5 border-terracotta px-[26px] py-[11px] font-body text-btn uppercase tracking-[0.14em] shadow-neo-ch cursor-none transition-all duration-fast hover:shadow-neo-ch-hover hover:translate-x-[2px] hover:translate-y-[2px] inline-flex items-center justify-center',
  
  // Small outline button
  outlineSm: 'bg-transparent text-charcoal border-1.5 border-charcoal px-[18px] py-[8px] font-body text-btn-sm uppercase tracking-[0.1em] cursor-none whitespace-nowrap transition-all duration-fast hover:bg-charcoal hover:text-linen',
  
  // Icon button (nav buttons)
  icon: 'w-[33px] h-[33px] border-1.5 border-charcoal/20 rounded-none flex items-center justify-center bg-transparent cursor-none transition-colors duration-200 hover:bg-charcoal [&:hover_svg]:stroke-linen',
  
  // Icon button dark variant
  iconDark: 'w-[33px] h-[33px] border-1.5 border-charcoal/20 rounded-none flex items-center justify-center bg-charcoal cursor-none transition-colors duration-200',
};

export const cardStyles = {
  // Product card
  product: 'border-1.5 border-charcoal bg-linen cursor-none relative overflow-hidden transition-all duration-[220ms] ease-out hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-neo-te-lg',
  
  // Product card featured (spans 2 rows)
  productFeatured: 'border-1.5 border-charcoal bg-linen cursor-none relative overflow-hidden transition-all duration-[220ms] ease-out hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-neo-te-lg row-span-2',
  
  // Product image container
  productImg: 'w-full flex items-center justify-center relative overflow-hidden',
  
  // Product info section
  productInfo: 'p-[13px_15px] border-t-1.5 border-charcoal flex justify-between items-center',
  
  // Journal card (dark background)
  journal: 'border border-linen/10 bg-linen/[0.03] overflow-hidden cursor-none transition-colors duration-[220ms] hover:border-terracotta',
  
  // Journal cover
  journalCover: 'w-full h-[165px] flex items-center justify-center border-b border-linen/10 overflow-hidden',
  
  // Journal cover small
  journalCoverSm: 'w-full h-[88px] flex items-center justify-center border-b border-linen/10 overflow-hidden',
  
  // Journal body
  journalBody: 'p-[16px_18px]',
};

export const badgeStyles = {
  // Product badge (New, Sale, etc.)
  product: 'absolute top-[12px] left-[12px] bg-terracotta text-linen text-label-xs uppercase tracking-[0.1em] px-[9px] py-[4px] z-[2]',
  
  // Sale badge (moss green)
  sale: 'absolute top-[12px] left-[12px] bg-moss text-linen text-label-xs uppercase tracking-[0.1em] px-[9px] py-[4px] z-[2]',
  
  // Sold stamp
  sold: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-12deg] border-[2.5px] border-[#B03030] text-[#B03030] font-display text-[15px] font-bold tracking-[0.16em] uppercase px-[12px] py-[5px] z-[3] opacity-85',
  
  // Tag (outline)
  tag: 'text-label-xs uppercase tracking-[0.12em] px-[9px] py-[3px] border border-terracotta text-terracotta',
  
  // New badge (rotated)
  new: 'bg-terracotta text-linen text-label-xs uppercase tracking-[0.12em] px-[10px] py-[5px] border-1.5 border-linen/15 rotate-[2deg]',
};

export const formStyles = {
  // Input field (on terracotta background)
  field: 'w-full block bg-linen/15 border border-linen/40 px-[14px] py-[11px] text-[12px] text-linen font-body outline-none mb-[11px] transition-all duration-fast focus:bg-linen/[0.22] focus:border-linen/65 placeholder:text-linen/50 placeholder:text-[11.5px]',
  
  // Input field (on light background)
  fieldLight: 'w-full block bg-transparent border-1.5 border-charcoal/20 px-[14px] py-[11px] text-[12px] text-charcoal font-body outline-none transition-all duration-fast focus:border-terracotta placeholder:text-charcoal/40 placeholder:text-[11.5px]',
  
  // Textarea
  textarea: 'w-full block bg-transparent border-1.5 border-charcoal/18 px-[14px] py-[10px] text-[12.5px] text-charcoal font-body resize-none outline-none transition-colors duration-fast focus:border-terracotta',
  
  // Upload zone
  uploadZone: 'border-1.5 border-dashed border-linen/40 px-[15px] py-[13px] flex items-center gap-[12px] cursor-none mb-[13px] transition-colors duration-fast hover:border-linen/75',
  
  // Label
  label: 'text-label-sm uppercase tracking-[0.14em] opacity-40 mb-[10px] block',
};

export const layoutStyles = {
  // Section padding
  section: 'px-section py-section',
  sectionSm: 'px-section-sm py-section-sm',
  
  // Container
  container: 'max-w-[1400px] mx-auto px-section',
  
  // Hero wrap (100vh)
  heroWrap: 'h-[calc(100vh-59px)] flex flex-col overflow-hidden',
  
  // Hero grid
  hero: 'relative flex-1 grid grid-cols-hero overflow-hidden min-h-0',
  
  // Section header
  sectionHeader: 'flex justify-between items-end mb-component-gap',
  
  // Product grid
  productGrid: 'grid grid-cols-products grid-rows-[auto_auto] gap-card-gap',
  
  // About strip
  aboutStrip: 'grid grid-cols-about border-b-1.5 border-charcoal',
  
  // Journal grid
  journalGrid: 'grid grid-cols-journal gap-card-gap',
  
  // Commission split
  commissionSplit: 'grid grid-cols-commission border-t border-charcoal',
  
  // Cart layout
  cartLayout: 'grid grid-cols-cart min-h-[60vh]',
};

export const typographyStyles = {
  // Section heading
  sectionHeading: 'font-display text-section-heading font-bold leading-[1.05] text-charcoal tracking-[-0.02em]',
  
  // Section heading with italic em
  sectionHeadingEm: 'font-display text-section-heading font-bold leading-[1.05] text-charcoal tracking-[-0.02em] [&_em]:italic [&_em]:text-terracotta',
  
  // Section label
  sectionLabel: 'text-label uppercase tracking-[0.18em] text-terracotta mb-[10px]',
  
  // Hero headline
  heroHeadline: 'font-display font-bold leading-[0.92] tracking-[-0.04em] text-charcoal',
  
  // Product name
  productName: 'font-display text-product-name font-bold text-charcoal mb-[2px]',
  
  // Product meta
  productMeta: 'text-product-meta opacity-45',
  
  // Product price
  productPrice: 'text-product-price font-bold text-terracotta',
  
  // Journal title
  journalTitle: 'font-display text-journal-title font-bold text-linen leading-[1.3] mb-[9px]',
  
  // Body text
  body: 'text-body leading-[1.75] text-charcoal opacity-55',
  
  // View all link
  viewAll: 'text-nav-link uppercase tracking-[0.14em] text-charcoal no-underline border-b-1.5 border-terracotta pb-[3px] cursor-none',
};

export const animationStyles = {
  // Scroll reveal
  reveal: 'opacity-0 translate-y-[22px] transition-all duration-slow ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0',
  
  // Pulsing pip
  pip: 'w-[7px] h-[7px] rounded-full bg-terracotta animate-pip',
  
  // Marquee
  marquee: 'inline-flex animate-marquee',
};

// Utility function to combine class names
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export default {
  button: buttonStyles,
  card: cardStyles,
  badge: badgeStyles,
  form: formStyles,
  layout: layoutStyles,
  typography: typographyStyles,
  animation: animationStyles,
  cn,
};
