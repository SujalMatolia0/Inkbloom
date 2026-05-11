"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { 
  ChevronDown, 
  ChevronUp, 
  Upload, 
  ShieldCheck, 
  Globe, 
  Mail, 
  Star, 
  Plus, 
  ArrowRight 
} from "lucide-react";

export default function CommissionPage() {
  const [selectedMedium, setSelectedMedium] = useState("Watercolour");
  const [selectedSize, setSelectedSize] = useState("A4");
  const [budgetValue, setBudgetValue] = useState(8000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mediums = [
    { name: "Watercolour", desc: "Soft washes, luminous depth, organic edges.", icon: <path d="M16 4 Q22 10 22 16 Q22 22 16 28 Q10 22 10 16 Q10 10 16 4Z"/> },
    { name: "Oil", desc: "Rich texture, impasto layers, classical depth.", icon: <circle cx="16" cy="16" r="10"/> },
    { name: "Ink", desc: "Bold linework, expressive marks, raw energy.", icon: <path d="M6 26 Q12 10 16 8 Q20 6 26 10"/> },
    { name: "Acrylic", desc: "Vivid colours, fast-drying, versatile finish.", icon: <rect x="8" y="8" width="16" height="16"/> },
    { name: "Mixed Media", desc: "Collage, layered textures, experimental finish.", icon: <ellipse cx="16" cy="16" rx="10" ry="7"/> },
    { name: "Not Sure", desc: "Let me recommend", icon: <Plus size={24} /> },
  ];

  const sizes = [
    { id: "A4", label: "A4", sub: "21×30cm" },
    { id: "A3", label: "A3", sub: "30×42cm" },
    { id: "A2", label: "A2", sub: "42×60cm" },
    { id: "24x36", label: "24×36\"", sub: "60×90cm" },
    { id: "36x48", label: "36×48\"", sub: "90×120cm" },
    { id: "Custom", label: "Custom", sub: "" },
  ];

  const faqs = [
    { q: "How long does a commission take?", a: "Most commissions take 2–4 weeks depending on size and complexity. Large oil paintings may take up to 6 weeks. I'll give you a specific timeline when I send the quote." },
    { q: "What is the payment structure?", a: "I require a 50% deposit to begin work. The remaining 50% is due upon final approval before shipping. Payments via Razorpay, UPI, or bank transfer." },
    { q: "Can I request revisions?", a: "Yes — I share sketch/WIP previews at key stages and welcome feedback. Major direction changes may incur additional charges, but small adjustments are always included." },
    { q: "Do you ship internationally?", a: "Yes! I ship worldwide. All artworks are rolled in archival tubes or flat-packed with protective layers, fully insured. Shipping costs depend on destination and size." },
    { q: "What if I don't like the final piece?", a: "I do everything possible to ensure you love the result through regular previews. If there's a genuine issue, we'll work together to find a solution — your satisfaction matters." },
    { q: "Do you do digital commissions?", a: "Yes — digital illustrations are available as high-resolution files, perfect for printing. These are typically faster and more affordable than physical pieces." },
  ];

  const pastWorks = [
    { title: "Monsoon Portrait", meta: "24×36\" · Private Collection", tag: "Watercolour", color: "art-warm" },
    { title: "Garden Study IV", meta: "36×48\" · Bangalore", tag: "Oil", color: "art-cool" },
    { title: "City Rhythm No.3", meta: "A3 · Mumbai", tag: "Ink", color: "art-sand" },
    { title: "Jaipur Memory", meta: "A2 · London", tag: "Mixed Media", color: "art-blush" },
  ];

  const testimonials = [
    { text: "The portrait exceeded every expectation. The way she captured the light and emotion — it felt like she'd known my grandmother personally.", author: "Priya M. · Bengaluru" },
    { text: "Fast turnaround, beautifully packaged, and the WIP updates kept me excited throughout the process. Will commission again for sure.", author: "Arjun S. · Mumbai" },
    { text: "I gifted this to my partner for our anniversary. She cried happy tears when she saw it. That's all I can say — absolutely perfect.", author: "Rohan K. · Delhi" },
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-linen">
      <Navbar />

      {/* HERO SECTION */}
      <section className="comm-hero">
        {/* LEFT */}
        <div className="hero-left">
          <div className="bg-ghost opacity-[0.05]">MADE</div>
          <div className="hero-inner reveal">
            <div className="sec-label">Custom Work</div>
            <h1 className="hero-title">
              Something made<br />
              <em>only</em> for<br />
              <span className="outline">you.</span>
            </h1>
            <p className="hero-body">
              Every commission starts with a conversation. Share your vision and I'll bring it to life in your chosen medium — a one-of-a-kind piece that belongs only to you.
            </p>
            <div className="status-pill">
              <div className="pip"></div>
              <span className="status-text">Open for Commissions · 3 Slots Left</span>
            </div>
          </div>
          <div className="slots-row reveal">
            <div className="slot-item">
              <div className="slot-num">3</div>
              <div className="slot-label">Slots Available</div>
            </div>
            <div className="slot-item">
              <div className="slot-num">48h</div>
              <div className="slot-label">Quote Turnaround</div>
            </div>
            <div className="slot-item">
              <div className="slot-num">2–4</div>
              <div className="slot-label">Weeks to Completion</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="hero-right-dark">
          <div className="dark-grid"></div>
          <div className="process-preview reveal">
            <div className="mb-8">
              <div className="sec-label text-linen/40">How It Works</div>
              <h2 className="font-serif text-[26px] font-bold text-linen leading-[1.1]">
                The <em className="text-terracotta italic">process.</em>
              </h2>
            </div>
            {[
              { n: 1, t: "Submit Your Brief", d: "Upload a reference image and describe your vision — size, mood, palette, purpose." },
              { n: 2, t: "Receive a Quote", d: "I'll review and send a detailed quote within 48 hours with timeline and pricing." },
              { n: 3, t: "Approve & Begin", d: "Confirm with a 50% deposit and I start creating. You'll receive regular WIP updates." },
              { n: 4, t: "Receive Your Art", d: "Final approval, balance payment, then your artwork ships — fully insured, worldwide." }
            ].map((step) => (
              <div key={step.n} className="process-item">
                <div className="process-num">{step.n}</div>
                <div>
                  <div className="process-title">{step.t}</div>
                  <div className="process-desc">{step.d}</div>
                </div>
              </div>
            ))}
          </div>
          
          <svg className="absolute bottom-10 right-10 opacity-[0.06] pointer-events-none" width="160" height="160" viewBox="0 0 160 160" fill="none">
            <circle cx="80" cy="80" r="70" stroke="#F0EBE3" strokeWidth="1.5"/>
            <circle cx="80" cy="80" r="45" stroke="#C17B5C" strokeWidth="1" strokeDasharray="4 8"/>
            <circle cx="80" cy="80" r="20" stroke="#F0EBE3" strokeWidth="0.8"/>
          </svg>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-inner">
          {[...Array(2)].map((_, i) => (
            <span key={i} className="flex">
              <span className="marquee-item">Watercolour</span><span className="marquee-sep">✦</span>
              <span className="marquee-item">Oil on Canvas</span><span className="marquee-sep">✦</span>
              <span className="marquee-item">Ink Illustration</span><span className="marquee-sep">✦</span>
              <span className="marquee-item">Acrylic</span><span className="marquee-sep">✦</span>
              <span className="marquee-item">Mixed Media</span><span className="marquee-sep">✦</span>
              <span className="marquee-item">Pet Portraits</span><span className="marquee-sep">✦</span>
              <span className="marquee-item">Abstract Studies</span><span className="marquee-sep">✦</span>
              <span className="marquee-item">Landscape</span><span className="marquee-sep">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* MEDIUM SELECTOR */}
      <section className="medium-section">
        <div className="medium-left reveal">
          <div className="sec-label">Choose Your Medium</div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-bold text-charcoal leading-[1.05] tracking-tight">
            Craft & <em className="italic text-terracotta">Material.</em>
          </h2>
          <p className="text-[12.5px] text-charcoal/60 leading-[1.78] mt-6 max-w-[280px]">
            Each medium has its own soul. Select the one that speaks to your vision, or let me recommend based on your reference.
          </p>
        </div>
        <div className="medium-right">
          <div className="medium-grid">
            {mediums.map((m) => (
              <div 
                key={m.name} 
                className={`medium-card reveal ${selectedMedium === m.name ? "active" : ""}`}
                onClick={() => setSelectedMedium(m.name)}
              >
                <div className="medium-check">
                  <svg viewBox="0 0 24 24" className="w-[9px] h-[9px] stroke-linen fill-none stroke-[2.5]"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="medium-icon">
                  <svg viewBox="0 0 32 32" className="w-[28px] h-[28px] stroke-terracotta fill-none stroke-[1.2]">
                    {typeof m.icon === 'string' ? <path d={m.icon}/> : m.icon}
                  </svg>
                </div>
                <div className="medium-name">{m.name}</div>
                <div className="medium-desc">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="form-section">
        {/* LEFT — Detailed Form */}
        <div className="form-left">
          <div className="sec-label">Commission Form</div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,40px)] font-bold text-charcoal leading-[1.05] tracking-tight mb-12">
            Tell me about <em className="italic text-terracotta">your piece.</em>
          </h2>

          <div className="field-group reveal">
            <label className="field-label">Your Name</label>
            <input className="field-input" type="text" placeholder="Full name"/>
          </div>
          <div className="field-group reveal">
            <label className="field-label">Email Address</label>
            <input className="field-input" type="email" placeholder="you@example.com"/>
          </div>
          <div className="field-group reveal">
            <label className="field-label">Subject / Piece Type</label>
            <input className="field-input" type="text" placeholder="e.g. Pet portrait, landscape, abstract study"/>
          </div>
          <div className="field-group reveal">
            <label className="field-label">Canvas Size</label>
            <div className="size-grid">
              {sizes.map((s) => (
                <button 
                  key={s.id}
                  className={`size-btn ${selectedSize === s.id ? "active" : ""}`}
                  onClick={() => setSelectedSize(s.id)}
                >
                  {s.label} <br />
                  <span className="text-[8px] font-normal tracking-normal">{s.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="field-group reveal">
            <label className="field-label">Budget Range</label>
            <div className="budget-row">
              <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/40">Min ₹2,000</span>
              <span className="budget-val">₹{budgetValue.toLocaleString('en-IN')}</span>
              <span className="text-[9px] font-bold tracking-widest uppercase text-charcoal/40">Max ₹50,000</span>
            </div>
            <input 
              type="range" 
              min="2000" 
              max="50000" 
              step="500" 
              value={budgetValue} 
              onChange={(e) => setBudgetValue(parseInt(e.target.value))}
            />
          </div>
          <div className="field-group reveal">
            <label className="field-label">Upload Reference Image (Optional)</label>
            <div className="upload-area">
              <Upload className="mb-3 opacity-30" size={28} />
              <div className="upload-label">Click to upload or drag & drop</div>
              <div className="upload-hint">PNG, JPG, PDF up to 10MB</div>
            </div>
          </div>
          <div className="field-group reveal">
            <label className="field-label">Describe Your Vision</label>
            <textarea className="field-input" rows={5} placeholder="Describe the mood, colours, composition, and any personal details that matter to you…"></textarea>
          </div>
        </div>

        {/* RIGHT — Summary & Submit */}
        <div className="form-right">
          <div className="hero-right-bg opacity-[0.05]"></div>
          <div className="form-right-inner">
            <div className="sec-label text-linen/50">Almost There</div>
            <h2 className="font-serif text-[clamp(26px,3vw,36px)] font-bold text-linen leading-[1.05] tracking-tight mb-3">
              Start your <em className="italic text-charcoal/70">commission.</em>
            </h2>
            <p className="text-[12px] text-linen/60 leading-[1.7] mb-8">
              Limited slots available this month. I personally review every brief and respond within 48 hours.
            </p>

            {/* Pricing reference */}
            <div className="mb-8">
              <div className="text-[8.5px] font-bold tracking-[0.16em] uppercase text-linen/45 mb-4">Typical Price Range</div>
              <div className="pricing-tags">
                <span className="p-tag">Small · ₹2k–5k</span>
                <span className="p-tag featured">Medium · ₹5k–15k</span>
                <span className="p-tag">Large · ₹15k–40k</span>
              </div>
            </div>

            <input className="form-field-dark" type="text" placeholder="Your name (confirm)"/>
            <input className="form-field-dark" type="email" placeholder="Email address (confirm)"/>
            <textarea className="form-field-dark" rows={3} placeholder="Anything else to add?" style={{ resize: 'none' }}></textarea>

            <button className="btn-submit-comm">Submit Commission →</button>
            <p className="right-note">
              By submitting, you agree to a 50% deposit upon approval. No work begins until you confirm and pay. All commissions come with an authenticity certificate.
            </p>

            {/* Trust indicators */}
            <div className="mt-10 pt-10 border-t border-linen/15 flex flex-col gap-5">
              <div className="flex items-center gap-3 text-[10.5px] text-linen/55">
                <ShieldCheck size={14} className="stroke-linen" />
                Money-back guarantee if you're not satisfied with the sketch
              </div>
              <div className="flex items-center gap-3 text-[10.5px] text-linen/55">
                <Globe size={14} className="stroke-linen" />
                Made in Jaipur, ships worldwide with full insurance
              </div>
              <div className="flex items-center gap-3 text-[10.5px] text-linen/55">
                <Mail size={14} className="stroke-linen" />
                Quote delivered within 48 hours, no obligation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PAST COMMISSIONS */}
      <section className="past-section">
        <div className="reveal">
          <div className="sec-label text-linen/40">Recent Work</div>
          <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-bold text-linen leading-none tracking-tight">
            Past <em className="italic text-terracotta">Commissions.</em>
          </h2>
        </div>
        <div className="past-grid mt-14">
          {pastWorks.map((work, i) => (
            <div key={i} className="past-card reveal">
              <div className="past-img">
                <div className={`past-img-inner ${work.color}`}></div>
                <div className="past-overlay"></div>
              </div>
              <div className="past-info">
                <span className="tag">{work.tag}</span>
                <div className="past-title">{work.title}</div>
                <div className="past-meta">{work.meta}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonial-section">
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial-item reveal">
            <div className="quote-stars">★★★★★</div>
            <div className="quote-mark">"</div>
            <div className="quote-text">{t.text}</div>
            <div className="quote-author">{t.author}</div>
          </div>
        ))}
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="sec-label">Common Questions</div>
        <h2 className="font-serif text-[clamp(28px,3.5vw,44px)] font-bold text-charcoal leading-none tracking-tight">
          FAQs & <em className="italic text-terracotta">Answers.</em>
        </h2>
        <div className="faq-grid reveal">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`faq-item ${openFaq === i ? "open" : ""}`}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div className="faq-q">
                <span className="faq-question">{faq.q}</span>
                <div className="faq-toggle">{openFaq === i ? "−" : "+"}</div>
              </div>
              <div className="faq-answer">
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
