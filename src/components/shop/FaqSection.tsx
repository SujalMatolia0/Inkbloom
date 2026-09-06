"use client";

import { useState, useMemo } from "react";
import { Plus, Minus, HelpCircle, Search, Sparkles, MessageCircle } from "lucide-react";
import Link from "next/link";

export interface FaqData {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const DEFAULT_FAQS: FaqData[] = [
  {
    id: "def-1",
    question: "How do I commission a custom Wall Art or Mural?",
    answer: "Click 'Commission Mural' on any piece or visit our Commission page. You can specify your wall width/height, surface type, city location, and inspiration. We provide an exact layout concept and quote within 24–48 hours.",
    category: "Wall Art & Murals",
    order: 1,
  },
  {
    id: "def-2",
    question: "How does Wedding Varmala / Garland Resin Preservation work?",
    answer: "After booking your keepsake shape (hexagon block, shadow block, platter clock, or arch), you courier your dried wedding flowers to Studio Vinyas in Ratangarh, Rajasthan. We send a full packing guide & address immediately upon booking.",
    category: "Resin & Keepsakes",
    order: 2,
  },
  {
    id: "def-3",
    question: "Can I combine two separate photos into one couple portrait?",
    answer: "Yes! In the Sketch Configurator, upload both photos and mention 'combine into one couple portrait' in the special instructions. Our artist Anki Matolia blends them seamlessly with authentic charcoal & graphite shading.",
    category: "Sketches & Portraits",
    order: 3,
  },
  {
    id: "def-4",
    question: "How are the artworks packaged and shipped across India?",
    answer: "Original canvases and resin pieces are packed in reinforced wooden cratings with multi-layer bubble wrap and corner foam guards. Sketches are shipped in rigid archival flat-packs or heavy-duty tubes, fully insured door-to-door.",
    category: "Shipping & Transit",
    order: 4,
  },
  {
    id: "def-5",
    question: "Can I request revisions or see work-in-progress (WIP) previews?",
    answer: "Absolutely! We share work-in-progress (WIP) photos and videos on WhatsApp/Email at key milestones before final sealing, resin curing, and framing so you are completely confident in the result.",
    category: "Commissions & Orders",
    order: 5,
  },
  {
    id: "def-6",
    question: "What mediums are available for custom canvases?",
    answer: "We specialize in heavy-textured acrylic impasto, traditional Rajasthani Pichwai with genuine gold leafing, minimalist earth tone abstracts, and classical oil on stretched Belgian linen.",
    category: "Canvas Paintings",
    order: 6,
  },
];

const CATEGORY_TABS = [
  "All Questions",
  "Wall Art & Murals",
  "Resin & Keepsakes",
  "Sketches & Portraits",
  "Canvas Paintings",
  "Shipping & Transit",
];

export function FaqSection({ dbFaqs = [] }: { dbFaqs?: FaqData[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All Questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Combine DB FAQs with defaults if DB is empty
  const allFaqs = dbFaqs.length > 0 ? dbFaqs : DEFAULT_FAQS;

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      // Category filter
      if (selectedCategory !== "All Questions" && faq.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesQ = faq.question.toLowerCase().includes(query);
        const matchesA = faq.answer.toLowerCase().includes(query);
        const matchesC = faq.category.toLowerCase().includes(query);
        if (!matchesQ && !matchesA && !matchesC) return false;
      }
      return true;
    });
  }, [allFaqs, selectedCategory, searchQuery]);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="py-20 px-6 md:px-16 bg-[#18100C] text-linen border-t-2 border-charcoal relative overflow-hidden">
      {/* Background Watermark */}
      <div
        className="absolute right-[-20px] top-[-30px] font-sans text-[130px] sm:text-[180px] font-black tracking-tighter text-transparent select-none pointer-events-none z-0"
        style={{ WebkitTextStroke: "1px rgba(240, 235, 227, 0.04)" }}
      >
        ANSWERS
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-linen/15">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-terra-pale mb-2">
              <Sparkles size={12} className="text-terra" />
              <span>Collector &amp; Client Knowledge Base</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-linen leading-tight">
              Frequently Asked <em className="italic text-terra-pale font-normal">Questions.</em>
            </h2>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-linen/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-9 pr-4 py-2.5 bg-[#251810] border border-linen/20 text-xs text-linen placeholder:text-linen/40 focus:border-terra outline-none font-sans"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar shrink-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10.5px] font-bold tracking-wider uppercase whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? "bg-terra text-linen border-terra shadow-sm"
                    : "bg-[#251810] border-linen/15 text-linen/70 hover:text-linen hover:border-linen/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Accordion FAQ List */}
        {filteredFaqs.length > 0 ? (
          <div className="divide-y divide-linen/15 border-y border-linen/15 bg-[#1C1410]">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq.id || index} className="transition-colors hover:bg-linen/[0.02]">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full text-left py-5 px-6 flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-[10px] font-mono font-bold text-terra-pale/70 uppercase tracking-widest px-2 py-0.5 bg-terra/10 border border-terra/30 hidden sm:inline-block">
                        {faq.category}
                      </span>
                      <span className="font-serif text-base sm:text-lg font-bold text-linen">
                        {faq.question}
                      </span>
                    </div>

                    <div
                      className={`w-7 h-7 flex items-center justify-center border border-linen/30 rounded-full shrink-0 transition-transform ${
                        isOpen ? "bg-terra text-linen border-terra rotate-180" : "text-linen/60"
                      }`}
                    >
                      {isOpen ? <Minus size={13} /> : <Plus size={13} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-xs sm:text-[13px] text-linen/80 font-sans leading-relaxed max-w-4xl animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 px-6 text-center border border-dashed border-linen/20 my-4 bg-[#1C1410]">
            <HelpCircle size={28} className="mx-auto text-terra mb-2 opacity-80" />
            <p className="text-xs text-linen/70">No questions found matching &ldquo;{searchQuery}&rdquo;.</p>
          </div>
        )}

        {/* Still Have Questions CTA */}
        <div className="mt-12 p-6 bg-[#251810] border border-terra/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terra/20 text-terra flex items-center justify-center shrink-0">
              <MessageCircle size={20} />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-linen">Have a question not listed here?</h4>
              <p className="text-xs text-linen/70 font-sans">
                Chat directly with Anki Matolia for custom sizing, wedding dates, or rush orders.
              </p>
            </div>
          </div>
          <Link
            href="/commission"
            className="btn-primary py-2.5 px-6 text-xs font-bold tracking-wider uppercase whitespace-nowrap"
          >
            Ask Artist Directly →
          </Link>
        </div>
      </div>
    </section>
  );
}
