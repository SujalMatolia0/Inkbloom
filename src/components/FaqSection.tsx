"use client";

import { useState, useMemo } from "react";
import { 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  MessageSquare, 
  Search, 
  ArrowRight,
  Layers,
  Palette,
  Truck,
  ShieldCheck,
  Brush
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export interface FaqData {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isPublished: boolean;
}

const FALLBACK_FAQS: FaqData[] = [
  {
    id: "fb-faq-1",
    question: "How does custom wall mural commissioning work?",
    answer: "We begin with a digital consultation to assess your wall dimensions, surface texture, and aesthetic themes. Once approved, we create digital concept sketches, schedule on-site execution dates, and use high-grade UV & weather-resistant acrylic pigments.",
    category: "Wall Art & Murals",
    order: 1,
    isPublished: true,
  },
  {
    id: "fb-faq-2",
    question: "How do I ship physical items (like wedding Varmala or baby keepsakes) for resin preservation?",
    answer: "After placing your order, our team sends you safe packing guidelines and courier coordination. Once we safely receive your sacred garlands, flowers, or keepsakes, our multi-stage dehydration, casting, and 7-day UV curing process begins in our studio.",
    category: "Resin & Keepsakes",
    order: 2,
    isPublished: true,
  },
  {
    id: "fb-faq-3",
    question: "Can you combine multiple photos into a single portrait sketch?",
    answer: "Yes, absolutely! Our master artists can merge separate reference photos of family members, couples, or pets into one cohesive charcoal, graphite, or caricature composition. You can upload multiple reference photos directly in the customizer.",
    category: "Sketches & Portraits",
    order: 3,
    isPublished: true,
  },
  {
    id: "fb-faq-4",
    question: "What materials and framing options do you use for canvas originals?",
    answer: "We paint on 100% Belgian archival primed cotton-linen canvas using artist-grade oils and heavy-body acrylics. We offer optional museum-grade teakwood float frames and solid charcoal pine frames ready to hang.",
    category: "Canvas Paintings",
    order: 4,
    isPublished: true,
  },
  {
    id: "fb-faq-5",
    question: "How are fragile resin artworks and large framed paintings shipped safely?",
    answer: "Every artwork is wrapped in acid-free glassine paper, enveloped in multilayer high-density bubble armor, and reinforced with corner edge guards in a heavy-duty wooden crate or reinforced corrugated box with full transit insurance.",
    category: "Shipping & Transit",
    order: 5,
    isPublished: true,
  },
  {
    id: "fb-faq-6",
    question: "What is the typical turnaround time for custom commission orders?",
    answer: "Handmade portrait sketches take 5-7 business days, resin keepsake preservation takes 12-18 days (due to flower dehydration and multi-layer curing), and large-scale murals take 1-3 weeks depending on complexity.",
    category: "Commissions & Orders",
    order: 6,
    isPublished: true,
  },
];

const CATEGORY_ICONS: Record<string, any> = {
  "Wall Art & Murals": Brush,
  "Resin & Keepsakes": Layers,
  "Sketches & Portraits": Palette,
  "Canvas Paintings": Palette,
  "Shipping & Transit": Truck,
  "Commissions & Orders": ShieldCheck,
};

export function FaqSection({
  faqs = [],
}: {
  faqs?: FaqData[];
}) {
  const items = faqs.length > 0 ? faqs : FALLBACK_FAQS;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [items[0]?.id || "fb-faq-1"]: true,
  });

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((f) => f.category || "General")));
    return ["All", ...unique];
  }, [items]);

  const filteredFaqs = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-24 md:py-32 bg-linen border-b-1.5 border-charcoal relative overflow-hidden selection:bg-terra selection:text-linen">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-moss/10 text-moss border border-moss/30 text-[10px] uppercase font-mono tracking-widest mb-4">
            <HelpCircle size={12} />
            <span>Curated Studio Knowledgebase</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-charcoal tracking-tight font-normal mb-4">
            Frequently Asked <span className="italic font-normal text-terra">Questions</span>
          </h2>
          <p className="text-sm md:text-base text-charcoal/70 font-sans max-w-xl mx-auto">
            Everything you need to know about our commissioning process, custom resin preservation, archival framing, and pan-India safe transit.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="max-w-4xl mx-auto mb-10 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. resin, sketch, framing, mural, shipping)..."
              className="w-full pl-11 pr-4 py-3 bg-paper border-1.5 border-charcoal text-sm text-charcoal placeholder:text-charcoal/40 font-mono focus:outline-none focus:bg-linen shadow-neo transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider border-1.5 transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-charcoal text-linen border-charcoal shadow-neo"
                      : "bg-paper text-charcoal/80 border-charcoal/30 hover:border-charcoal hover:bg-linen"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-12 text-center bg-paper border-1.5 border-charcoal shadow-neo">
              <HelpCircle className="mx-auto text-charcoal/30 mb-3" size={32} />
              <p className="text-sm font-mono text-charcoal/70">No questions found matching your filter.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs font-mono text-terra underline uppercase font-bold"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id || index}
                  className="bg-paper border-1.5 border-charcoal transition-all overflow-hidden shadow-neo hover:shadow-neo-lg"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 group cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="font-mono text-xs text-terra font-bold mt-0.5 shrink-0">
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <div>
                        <h3 className="text-base md:text-lg font-serif font-medium text-charcoal group-hover:text-terra transition-colors leading-snug">
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <span className="inline-block text-[9.5px] font-mono uppercase tracking-wider text-charcoal/50 mt-1">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-none border border-charcoal flex items-center justify-center shrink-0 transition-transform duration-200 mt-0.5 ${
                        isOpen ? "bg-terra text-linen rotate-180" : "bg-linen text-charcoal group-hover:bg-terra/10"
                      }`}
                    >
                      <ChevronDown size={15} />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 md:px-6 pb-6 pt-1 text-sm md:text-[14.5px] font-sans text-charcoal/80 leading-relaxed border-t border-charcoal/10 ml-7">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Direct Studio Inquiry Callout */}
        <div className="max-w-4xl mx-auto mt-14 p-8 bg-paper border-1.5 border-charcoal shadow-neo flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-terra text-linen flex items-center justify-center border-1.5 border-charcoal shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <h4 className="text-lg font-serif font-bold text-charcoal">Have a custom project or unanswered question?</h4>
              <p className="text-xs font-mono text-charcoal/70 mt-0.5">
                Our artist directly reviews ideas, wall blueprints, and custom requests.
              </p>
            </div>
          </div>

          <Link
            href="/commission"
            className="w-full md:w-auto px-6 py-3 bg-charcoal text-linen border-1.5 border-charcoal text-xs font-mono uppercase tracking-widest font-bold hover:bg-terra hover:text-linen transition-all shadow-neo hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none flex items-center justify-center gap-2 shrink-0"
          >
            <span>Commission Art</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
