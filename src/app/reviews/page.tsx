import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { Star, MessageSquareQuote, CheckCircle2, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "Patron Reviews & Testimonials | Vinyas Studio",
  description: "Read real collector reviews, client stories, and feedback on custom commissions, portraits, and resin preservation.",
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      <section className="pt-24 pb-12 md:py-20 bg-charcoal text-linen text-center px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 text-terra-pale border border-terra/30 text-[10px] uppercase font-mono tracking-widest">
            <Star size={12} fill="currentColor" className="text-amber-400" />
            <span>Collector Stories</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] font-bold">
            Words From Our <em className="text-terra italic">Patrons</em>
          </h1>
          <p className="text-xs sm:text-[14px] text-linen/75 max-w-xl mx-auto font-sans leading-relaxed">
            Over 250+ custom commissions delivered to art lovers across India and internationally. Here is what collectors say about our craftsmanship and packaging.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
