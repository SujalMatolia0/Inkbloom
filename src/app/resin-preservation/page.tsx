import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Sparkles, Flower2, Layers, CheckCircle2, ArrowRight, ShieldCheck, Heart, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Resin Varmala & Flower Preservation | Vinyas Studio",
  description: "Preserve your wedding varmala, bridal bouquet, and precious flowers in crystal clear resin clocks, blocks, and wall hangings.",
};

export default function ResinPreservationPage() {
  const steps = [
    {
      num: "01",
      title: "Book & Send Flowers",
      desc: "Place your order online or request a custom size. Courier your fresh or semi-dried wedding varmala / flowers following our simple packing guide."
    },
    {
      num: "02",
      title: "Archival Dehydration",
      desc: "Flowers undergo a 7–10 day controlled silica-gel dehydration process in our studio to freeze their vibrant natural color and shape."
    },
    {
      num: "03",
      title: "Layered Resin Casting",
      desc: "Artfully composed with gold foil accents, photo keepsakes, or name engravings, then poured in ultra-clear UV-inhibited crystal resin."
    },
    {
      num: "04",
      title: "7-Day Curing & Diamond Polish",
      desc: "After multi-layer curing, each block or clock is hand-sanded and diamond-buffed for unmatched mirror clarity, then safely delivered to your doorstep."
    }
  ];

  const packages = [
    {
      name: "Hexagon / Square Resin Block",
      size: "8\" to 12\" Diameter",
      price: "From ₹3,499",
      ideal: "Ideal for bridal bouquet & couple initials",
      features: ["3D flower arrangement", "Optional gold/silver foil leafing", "Engraved name & date plaque", "Wooden LED base option"]
    },
    {
      name: "Resin Varmala Wall Clock",
      size: "12\" to 16\" Diameter",
      price: "From ₹5,999",
      ideal: "Full wedding garland preservation",
      features: ["Complete varmala preservation", "Silent quartz clock mechanism", "Roman / Minimalist numbering", "Archival UV resistance"]
    },
    {
      name: "Grand Heirloom Table / Plaque",
      size: "16\" to 24\" Custom Shape",
      price: "From ₹9,999",
      ideal: "Multiple garlands, varmalas & photo insert",
      features: ["Multi-garland grand casting", "Embedded photo / invitation card", "Custom teakwood stand / legs", "Priority 14-day turnaround"]
    }
  ];

  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 md:py-24 bg-charcoal text-linen relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 text-terra-pale border border-terra/30 text-[10px] uppercase font-mono tracking-widest">
              <Flower2 size={12} />
              <span>Sacred Flower Preservation</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] leading-[1.1] font-bold">
              Turn Wedding Flowers into <em className="text-terra italic">Timeless Art.</em>
            </h1>
            <p className="text-xs sm:text-[14px] text-linen/75 leading-relaxed font-sans">
              Don&apos;t let your wedding Varmala or special occasion flowers fade away. Our studio preserves sacred garlands, bridal bouquets, and memory flowers in crystal clear resin blocks, clocks, and heirloom decor.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/commission"
                className="px-6 py-3 bg-terra text-linen font-mono text-xs uppercase font-bold tracking-widest hover:bg-linen hover:text-charcoal transition-all shadow-neo flex items-center gap-2"
              >
                <span>Preserve Your Varmala</span>
                <ArrowRight size={14} />
              </Link>
              <Link
                href="#packages"
                className="px-6 py-3 border border-linen/40 text-linen font-mono text-xs uppercase font-bold tracking-widest hover:border-linen hover:bg-linen/10 transition-all"
              >
                View Pricing & Sizes
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="border-2 border-terra p-2 bg-linen/5 shadow-neo">
              <div className="relative aspect-4/3 w-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=900&auto=format&fit=crop&q=85"
                  alt="Wedding Varmala Resin Preservation"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-cover"
                />
              </div>
              <div className="p-4 bg-charcoal border-t border-linen/15 flex items-center justify-between text-xs font-mono">
                <span className="text-terra-pale font-bold">✦ Botanical Hexagon Frame</span>
                <span className="text-linen/60">Ratangarh Studio Original</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-[10px] font-mono text-terra font-bold uppercase tracking-widest mb-2">Our Method</div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
            The 4-Step <em className="text-terra italic">Preservation Process</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.num} className="p-6 bg-paper border-1.5 border-charcoal shadow-neo flex flex-col justify-between">
              <div>
                <span className="font-mono text-2xl font-bold text-terra mb-3 block">{step.num}.</span>
                <h3 className="font-serif font-bold text-lg text-charcoal mb-2">{step.title}</h3>
                <p className="text-xs text-charcoal/70 leading-relaxed font-sans">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages & Pricing */}
      <section id="packages" className="py-16 md:py-24 bg-linen border-t-1.5 border-b-1.5 border-charcoal">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-[10px] font-mono text-terra font-bold uppercase tracking-widest mb-2">Preservation Options</div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal">
              Popular Sizes & <em className="text-terra italic">Starting Prices</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, idx) => (
              <div key={idx} className="bg-paper border-1.5 border-charcoal p-8 shadow-neo flex flex-col justify-between relative">
                {idx === 1 && (
                  <span className="absolute -top-3 left-6 px-3 py-0.5 bg-terra text-linen text-[9px] font-mono font-bold uppercase tracking-widest border border-charcoal">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-serif font-bold text-xl text-charcoal mb-1">{pkg.name}</h3>
                  <p className="text-xs font-mono text-charcoal/60 mb-4">{pkg.size}</p>
                  <div className="text-2xl font-serif font-bold text-terra mb-2">{pkg.price}</div>
                  <p className="text-xs text-charcoal/70 italic mb-6">{pkg.ideal}</p>

                  <ul className="space-y-2 mb-8 border-t border-charcoal/10 pt-4">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-charcoal/80 font-mono">
                        <CheckCircle2 size={13} className="text-terra shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/commission"
                  className="w-full py-3 bg-charcoal text-linen font-mono text-xs uppercase font-bold tracking-widest text-center hover:bg-terra transition-colors"
                >
                  Book Preservation
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flower Care Pre-Transit Guide */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="bg-paper border-1.5 border-charcoal p-8 shadow-neo space-y-6">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-terra" />
            <div>
              <h3 className="font-serif font-bold text-xl text-charcoal">How to send fresh flowers after your event</h3>
              <p className="text-xs font-mono text-charcoal/60">Timing is key for maximum color preservation</p>
            </div>
          </div>
          <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
            For best results, courier your Varmala within <strong>1 to 3 days</strong> post-wedding. Wrap flower stems in slightly damp tissue paper, place in a ventilated cardboard box with cooling gel packs, and ship via Express courier to our studio in Ratangarh, Rajasthan. We guide you step-by-step upon order placement.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
