import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Hero } from '@/components/Hero';
import { AboutStrip } from '@/components/AboutStrip';
import { ShopSection } from '@/components/ShopSection';
import { JournalSection } from '@/components/JournalSection';
import { CommissionSection } from '@/components/CommissionSection';
import { JourneySection } from '@/components/JourneySection';
import { TestimonialsSection, type TestimonialData } from '@/components/TestimonialsSection';
import { FaqSection, type FaqData } from '@/components/FaqSection';
import { Marquee } from '@/components/ui/Marquee';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CreativeLoader } from '@/components/ui/CreativeLoader';
import { VINYAS_CATALOG } from '@/data/artworks';

export const dynamic = 'force-dynamic';

async function ShopSectionWrapper() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
  } catch (error) {
    console.error('Failed to fetch products for homepage:', error);
  }

  // Graceful fallback to catalog artworks if DB query is empty/failed
  if (!products || products.length === 0) {
    products = VINYAS_CATALOG.slice(0, 6).map((art) => ({
      id: art.id,
      title: art.title,
      slug: art.id,
      description: art.description,
      price: art.price,
      images: [art.image],
      stock: 1,
      category: art.category,
    }));
  }

  return <ShopSection products={products} />;
}

async function JournalSectionWrapper() {
  let posts: any[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 3,
    });
  } catch (error) {
    console.error('Failed to fetch journal posts for homepage:', error);
  }
  return <JournalSection posts={posts} />;
}

async function TestimonialsSectionWrapper() {
  let testimonials: TestimonialData[] = [];
  try {
    const data = await prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    testimonials = data as unknown as TestimonialData[];
  } catch (e) {
    console.error('Failed to fetch testimonials for homepage:', e);
  }
  return <TestimonialsSection testimonials={testimonials} />;
}

async function FaqSectionWrapper() {
  let faqs: FaqData[] = [];
  try {
    const data = await prisma.faq.findMany({
      where: { isPublished: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
    faqs = data as unknown as FaqData[];
  } catch (e) {
    console.error('Failed to fetch FAQs for homepage:', e);
  }
  return <FaqSection faqs={faqs} />;
}

export default function Home() {
  return (
    <main>
      <ScrollReveal />
      
      <Navbar />
      
      <div className="hero-wrap">
        <Hero />
        <Marquee />
      </div>

      <AboutStrip />
      
      <Suspense fallback={<div className="py-32 flex justify-center bg-linen"><CreativeLoader size="lg" /></div>}>
        <ShopSectionWrapper />
      </Suspense>
      
      <JourneySection />

      <Suspense fallback={<div className="py-24 flex justify-center bg-paper"><CreativeLoader size="lg" /></div>}>
        <TestimonialsSectionWrapper />
      </Suspense>
      
      <Suspense fallback={<div className="py-32 flex justify-center bg-deep"><CreativeLoader size="lg" /></div>}>
        <JournalSectionWrapper />
      </Suspense>

      <Suspense fallback={<div className="py-24 flex justify-center bg-linen"><CreativeLoader size="lg" /></div>}>
        <FaqSectionWrapper />
      </Suspense>
      
      <CommissionSection />
      <Footer />
    </main>
  );
}
