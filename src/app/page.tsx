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
import { Marquee } from '@/components/ui/Marquee';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CreativeLoader } from '@/components/ui/CreativeLoader';

export const dynamic = 'force-dynamic';

async function ShopSectionWrapper() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 6,
  });
  return <ShopSection products={products} />;
}

async function JournalSectionWrapper() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 3,
  });
  return <JournalSection posts={posts} />;
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
      
      <Suspense fallback={<div className="py-32 flex justify-center bg-deep"><CreativeLoader size="lg" /></div>}>
        <JournalSectionWrapper />
      </Suspense>
      
      <CommissionSection />
      <Footer />
    </main>
  );
}
