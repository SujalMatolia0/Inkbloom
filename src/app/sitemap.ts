import { MetadataRoute } from 'next';
import { GALLERY_3D_ARTWORKS } from '@/data/artworks';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://vinyas.art';

  const staticRoutes = [
    '',
    '/portfolio',
    '/shop',
    '/commission',
    '/journal',
    '/about',
    '/faq',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
    '/care-instructions',
    '/resin-preservation',
    '/reviews',
    '/contact',
  ];

  // Dynamic Product Slugs from Artworks dataset
  const productRoutes = GALLERY_3D_ARTWORKS.map((artwork) => ({
    url: `${baseUrl}/shop/${artwork.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Dynamic Journal Slugs
  const journalSlugs = [
    'making-of-boho-bloom-mural',
    'resin-varmala-preservation-guide',
    'charcoal-portrait-commission-process',
    'art-of-framing-archival-canvas',
  ];

  const journalRoutes = journalSlugs.map((slug) => ({
    url: `${baseUrl}/journal/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const staticPageRoutes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/shop' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1.0 : route === '/commission' || route === '/shop' ? 0.9 : 0.7,
  }));

  return [...staticPageRoutes, ...productRoutes, ...journalRoutes];
}
