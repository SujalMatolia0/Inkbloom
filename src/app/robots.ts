import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://vinyas.art';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/cart',
        '/checkout',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/admin',
        '/admin/',
        '/api/',
        '/profile/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
