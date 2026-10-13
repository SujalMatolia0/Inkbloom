import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Scale, FileText, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Vinyas Studio",
  description: "Review terms of service, commission agreements, intellectual property rights, and studio policies.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      <section className="pt-24 pb-14 md:py-20 bg-charcoal text-linen flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 text-terra-pale border border-terra/30 text-[10px] uppercase font-mono tracking-widest mb-4">
            <Scale size={12} />
            <span>Studio Agreement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] font-bold mb-4">
            Terms & <em className="text-terra italic">Conditions</em>
          </h1>
          <p className="text-xs sm:text-[14px] text-linen/70 max-w-xl mx-auto">
            These terms govern your use of the Vinyas website, shop purchases, and custom artwork commission agreements.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex-1 w-full space-y-8">
        <div className="bg-paper border-1.5 border-charcoal p-6 sm:p-10 shadow-neo space-y-8 text-charcoal">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              1. General Terms
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              Vinyas (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;studio&rdquo;) is an independent art studio operated by artist Anki Matolia in Ratangarh, Rajasthan. By accessing our website, placing an order in our shop, or submitting a custom commission request, you agree to comply with these terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              2. Intellectual Property & Copyright
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              All artworks, painting designs, digital illustrations, site copy, imagery, and 3D salon assets displayed on this site are the intellectual property of Vinyas Studio and Anki Matolia.
            </p>
            <ul className="list-disc list-inside text-xs text-charcoal/70 space-y-1 font-mono pl-2">
              <li>Purchasing a physical original painting grants you full physical ownership of the artwork.</li>
              <li>Copyright and reproduction rights remain exclusively with the artist unless explicitly assigned via a commercial licensing agreement.</li>
              <li>Artworks may not be scanned, resold as digital prints, or used for commercial merchandise without written consent.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              3. Commission Process & Approvals
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              Custom commissions (portraits, resin keepsakes, murals, custom canvas works) follow a dedicated milestone process. We provide digital draft previews for client feedback prior to final sealing or dispatch. Minor revisions are accommodated within the original quote; structural changes after client approval may incur additional material/time fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              4. Pricing & Payments
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              All prices listed on the site are in Indian Rupees (INR ₹) unless otherwise specified. We reserve the right to modify prices for custom projects based on dimensions, medium, and frame requirements prior to order confirmation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              5. Handcrafted Variations
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              Because every piece is individually painted and handcrafted, subtle variations in texture, color tones, wood grain, or resin flower placements are natural characteristics of handmade art that give each piece its unique character.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              6. Governing Law
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of India, with jurisdiction in Churu / Rajasthan courts.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
