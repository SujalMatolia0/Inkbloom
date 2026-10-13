import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Truck, ShieldCheck, Clock, PackageCheck, HelpCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Vinyas Studio",
  description: "Learn about our safe artwork packaging, transit insurance, pan-India delivery, and international shipping guidelines.",
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-24 pb-14 md:py-20 bg-charcoal text-linen flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 text-terra-pale border border-terra/30 text-[10px] uppercase font-mono tracking-widest mb-4">
            <Truck size={12} />
            <span>Pan-India & Global Delivery</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] font-bold mb-4">
            Shipping & <em className="text-terra italic">Delivery Policy</em>
          </h1>
          <p className="text-xs sm:text-[14px] text-linen/70 max-w-xl mx-auto">
            Every original painting, custom portrait, and resin keepsake is packed with multilayer archival armor and shipped securely from our studio in Ratangarh, Rajasthan.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex-1 w-full space-y-12">
        {/* Quick Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <PackageCheck size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Archival Packaging</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Glassine protective wrap, thick bubble armor, and reinforced corner guards or wooden crates.
            </p>
          </div>

          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <Clock size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Dispatch Timelines</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Ready shop art dispatches in 3–5 business days. Custom commissions take 2–3 weeks.
            </p>
          </div>

          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <ShieldCheck size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Transit Insurance</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Full transit coverage for original canvas and resin works against transit damage.
            </p>
          </div>
        </div>

        {/* Policy Details */}
        <div className="bg-paper border-1.5 border-charcoal p-6 sm:p-10 shadow-neo space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              1. Domestic Shipping (Pan-India)
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              We ship across all pin codes in India through trusted courier partners (BlueDart, Delhivery, DTDC, and India Post Speed Post for remote areas). All shipments include real-time tracking links sent via email and SMS upon dispatch.
            </p>
            <ul className="list-disc list-inside text-xs text-charcoal/70 space-y-1 font-mono pl-2">
              <li>Standard Domestic Transit: 4 – 7 business days post-dispatch.</li>
              <li>Express Metro Transit: 2 – 4 business days post-dispatch.</li>
              <li>Complimentary Free Shipping on all domestic orders of ₹2,499 or more (Flat ₹150 insured shipping fee for orders under ₹2,499).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              2. International Shipping
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              We proudly ship original artworks and custom portraits worldwide (USA, UK, UAE, Europe, Australia, Canada, etc.) via DHL Express and FedEx International.
            </p>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              <em>Note:</em> International custom duties, import taxes, or local VAT (if applicable) are the responsibility of the recipient and will be billed by the local customs authority upon arrival.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              3. Sending Sacred Flowers / Keepsakes for Resin Preservation
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              For Varmala and wedding flower resin preservation, clients send their fresh or semi-dried garlands to our studio in Ratangarh, Rajasthan. Upon placing your order, we provide step-by-step instructions on how to wrap, cool-pack, and courier your flowers to preserve color integrity during transit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              4. Damaged or Delayed Packages
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              Every package is insured during transit. In the rare event that your package arrives with physical box damage, please take unboxing photos and videos before opening and contact us within 48 hours at <a href={`mailto:${SITE_CONFIG.email}`} className="text-terra underline font-semibold">{SITE_CONFIG.email}</a> or via our <Link href="/contact" className="text-terra underline font-semibold">Contact page</Link>.
            </p>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="p-6 bg-charcoal text-linen border-1.5 border-charcoal flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle size={24} className="text-terra-pale shrink-0" />
            <div>
              <h4 className="font-serif font-bold text-base">Questions about your delivery?</h4>
              <p className="text-xs text-linen/70">Our studio team is here to assist with tracking and custom requests.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 bg-terra text-linen font-mono text-xs uppercase font-bold tracking-wider hover:bg-linen hover:text-charcoal transition-all shrink-0"
          >
            Contact Studio
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
