import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SITE_CONFIG } from "@/lib/site";
import { RefreshCw, ShieldAlert, HeartHandshake, FileCheck2, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Refund Policy | Vinyas Studio",
  description: "Read our returns, replacement, 50% deposit policies, and custom artwork rules.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-24 pb-14 md:py-20 bg-charcoal text-linen flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 text-terra-pale border border-terra/30 text-[10px] uppercase font-mono tracking-widest mb-4">
            <RefreshCw size={12} />
            <span>Fair &amp; Transparent Studio Rules</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] font-bold mb-4">
            Returns &amp; <em className="text-terra italic">Refund Policy</em>
          </h1>
          <p className="text-xs sm:text-[14px] text-linen/70 max-w-xl mx-auto">
            Because our artworks are custom-crafted and handmade to order, we maintain clear guidelines on deposits, previews, and transit damage protection.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex-1 w-full space-y-12">
        {/* Core Principles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <FileCheck2 size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Preview Approvals</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Custom portraits &amp; commissions receive digital preview approvals before final sealing or shipping.
            </p>
          </div>

          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <ShieldAlert size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Transit Damage Protection</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              If an item is damaged in transit, we arrange repair or remake free of charge.
            </p>
          </div>

          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <HeartHandshake size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Handcrafted Guarantee</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Includes up to 2 rounds of sketch revisions during the initial preview stage.
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-paper border-1.5 border-charcoal p-6 sm:p-10 shadow-neo space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              1. Custom Commissions &amp; Deposit Terms
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              All custom commissions (charcoal portraits, resin varmala preservation, murals, and personalized gifts) require a <strong>{SITE_CONFIG.payments.depositPercentage} deposit</strong> to confirm your slot and begin sketch/design work.
            </p>
            <ul className="list-disc list-inside text-xs text-charcoal/70 space-y-1.5 font-mono pl-2">
              <li>The deposit is non-refundable once initial sketch work, material preparation, or flower dehydration has commenced.</li>
              <li>Up to 2 rounds of digital preview revisions are included before final execution or casting.</li>
              <li>The remaining balance is payable upon your final approval of the digital preview prior to dispatch.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              2. Resin Varmala &amp; Flower Preservation Risk Notice
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              Preservation results depend directly on the condition and freshness of flowers upon arrival at our Ratangarh studio. If flowers arrive severely bruised or moldy, we contact you immediately to discuss flower replacement options before casting. Once resin casting begins, flower preservation items cannot be refunded.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              3. Ready-to-Ship Store Items
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              For non-personalized ready items (such as ready original canvas paintings or non-custom hampers), you may request a return within <strong>7 days</strong> of delivery if the item is unused and in original packaging. Personalized/customized gifts are non-returnable.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold text-charcoal border-b border-charcoal/15 pb-2">
              4. Transit Damage Protocol
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed">
              In the unlikely event that your package arrives damaged:
            </p>
            <ol className="list-decimal list-inside text-xs text-charcoal/70 space-y-1.5 font-mono pl-2">
              <li>Record unboxing photos or video showing the outer package and damaged artwork.</li>
              <li>Email us within 48 hours at <a href={`mailto:${SITE_CONFIG.email}`} className="text-terra underline font-semibold">{SITE_CONFIG.email}</a> or contact us via our <Link href="/contact" className="text-terra underline font-semibold">Contact page</Link>.</li>
              <li>We will inspect the evidence and arrange repair, remake where feasible, or appropriate resolution at no added cost to you.</li>
            </ol>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="p-6 bg-charcoal text-linen border-1.5 border-charcoal flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HelpCircle size={24} className="text-terra-pale shrink-0" />
            <div>
              <h4 className="font-serif font-bold text-base">Questions about returns or deposits?</h4>
              <p className="text-xs text-linen/70">Reach out directly for assistance with your order.</p>
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
