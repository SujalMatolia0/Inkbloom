"use client";

import { useState } from "react";
import { Star, Quote, Sparkles, ChevronLeft, ChevronRight, CheckCircle2, MessageSquareQuote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface TestimonialData {
  id: string;
  clientName: string;
  clientRole: string | null;
  content: string;
  artworkTitle: string | null;
  rating: number;
  image: string | null;
  isFeatured: boolean;
  order: number;
}

const FALLBACK_TESTIMONIALS: TestimonialData[] = [
  {
    id: "fb-1",
    clientName: "Priya & Rohan Sharma",
    clientRole: "Newlyweds • Mumbai",
    artworkTitle: "Botanical Varmala Hexagon Preservation",
    content: "Our wedding garland was preserved so breathtakingly in clear crystal resin. The golden flakes and custom date engraving make it the centerpiece of our home. Truly priceless craftsmanship!",
    rating: 5,
    image: null,
    isFeatured: true,
    order: 1,
  },
  {
    id: "fb-2",
    clientName: "Arjun Mehta",
    clientRole: "Founder, Roastery Cafe • Bengaluru",
    artworkTitle: "Editorial Neo-Brutalist Wall Mural",
    content: "Vinyas transformed our flagship cafe wall into an absolute talking point. The linework, earthy terracotta palette, and raw energy exceeded all our expectations. Customers click photos here every single day.",
    rating: 5,
    image: null,
    isFeatured: true,
    order: 2,
  },
  {
    id: "fb-3",
    clientName: "Sneha Kulkarni",
    clientRole: "Art Collector • Pune",
    artworkTitle: "Grandparents Charcoal Heirloom Portrait",
    content: "I had an old, low-resolution photograph of my grandparents. The charcoal sketch brought their expressions back to life with so much emotion, texture, and dignity. My entire family was moved to tears.",
    rating: 5,
    image: null,
    isFeatured: true,
    order: 3,
  },
  {
    id: "fb-4",
    clientName: "Vikramaditya Roy",
    clientRole: "Architect & Interior Designer • Delhi",
    artworkTitle: "Terracotta Dream Canvas #04",
    content: "The texture and rich pigment depth in person are unmatched compared to digital screens. The teak float frame arrived in bulletproof packaging without a single scratch. Highly recommended studio!",
    rating: 5,
    image: null,
    isFeatured: true,
    order: 4,
  },
];

export function TestimonialsSection({
  testimonials = [],
}: {
  testimonials?: TestimonialData[];
}) {
  const displayItems = testimonials.length > 0 ? testimonials : FALLBACK_TESTIMONIALS;
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);
  };

  return (
    <section className="relative py-24 md:py-32 bg-paper border-b-1.5 border-charcoal overflow-hidden selection:bg-terra selection:text-linen">
      {/* Background Decorative Accent Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-terra/5 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-moss/5 rounded-full blur-3xl pointer-events-none -ml-24 -mb-24" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b-1.5 border-charcoal/15 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 text-terra border border-terra/30 text-[10px] uppercase font-mono tracking-widest mb-4">
              <Sparkles size={12} />
              <span>Collector Voices & Stories</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal tracking-tight font-normal">
              Words From Our <span className="italic font-normal text-terra">Patrons</span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1 text-amber-500 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" />
                ))}
              </div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-charcoal/60">
                100% Handcrafted Satisfaction
              </p>
            </div>

            {/* Navigation Buttons for mobile / slider */}
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                aria-label="Previous testimonial"
                className="w-10 h-10 flex items-center justify-center border-1.5 border-charcoal bg-linen hover:bg-terra hover:text-linen text-charcoal transition-all shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next testimonial"
                className="w-10 h-10 flex items-center justify-center border-1.5 border-charcoal bg-linen hover:bg-terra hover:text-linen text-charcoal transition-all shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bento / Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col justify-between p-6 sm:p-7 bg-linen border-1.5 border-charcoal shadow-neo hover:shadow-neo-lg transition-all group relative overflow-hidden"
            >
              {/* Top Accent line & quote watermark */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-charcoal group-hover:bg-terra transition-colors" />
              <Quote className="absolute -bottom-4 -right-4 text-charcoal/5 group-hover:text-terra/10 transition-colors w-24 h-24 pointer-events-none" />

              <div>
                {/* Star rating & Artwork badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>

                  <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 bg-charcoal/5 border border-charcoal/15 text-charcoal/70">
                    Verified
                  </span>
                </div>

                {/* Artwork Title if present */}
                {item.artworkTitle && (
                  <div className="mb-3.5 inline-block text-[10px] font-mono tracking-wider font-bold text-terra uppercase bg-terra/10 px-2.5 py-1 border-l-2 border-terra">
                    {item.artworkTitle}
                  </div>
                )}

                {/* Review Text */}
                <p className="text-sm md:text-[14.5px] leading-relaxed text-charcoal/85 font-serif italic mb-6">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Client Info Footer */}
              <div className="pt-4 border-t border-charcoal/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-widest text-charcoal group-hover:text-terra transition-colors">
                    {item.clientName}
                  </h4>
                  {item.clientRole && (
                    <p className="text-[10px] font-mono text-charcoal/60 mt-0.5 tracking-wider">
                      {item.clientRole}
                    </p>
                  )}
                </div>

                <div className="w-7 h-7 rounded-full bg-terra/10 border border-terra/30 flex items-center justify-center text-terra shrink-0">
                  <MessageSquareQuote size={13} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Micro-Bar */}
        <div className="mt-12 p-4 bg-charcoal text-linen border-1.5 border-charcoal flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-terra-pale" />
            <span>Over 250+ custom commissions delivered worldwide</span>
          </div>
          <div className="text-linen/60 text-[11px]">
            Have an artwork you commissioned? Share your review with the studio!
          </div>
        </div>
      </div>
    </section>
  );
}
