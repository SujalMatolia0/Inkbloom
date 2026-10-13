import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SITE_CONFIG } from "@/lib/site";
import { ShieldCheck, Lock, Eye, Server } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Vinyas Studio",
  description: "Learn how Vinyas handles personal data, reference photos, contact details, and DPDP compliance disclosures.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      <section className="pt-24 pb-14 md:py-20 bg-charcoal text-linen flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 text-terra-pale border border-terra/30 text-[10px] uppercase font-mono tracking-widest mb-4">
            <Lock size={12} />
            <span>Data Protection &amp; Confidentiality</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] font-bold mb-4">
            Privacy <em className="text-terra italic">Policy</em>
          </h1>
          <p className="text-xs sm:text-[14px] text-linen/70 max-w-xl mx-auto font-sans">
            Effective Date: October 2026. Disclosures pursuant to India&apos;s Digital Personal Data Protection (DPDP) standards.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex-1 w-full space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <Eye size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Confidential Photos</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
              Uploaded reference photos are used exclusively for creating your artwork and kept private.
            </p>
          </div>

          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <Lock size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Encrypted Payments</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
              Payments are handled via Razorpay or direct bank transfer. We never store credit card or bank credentials.
            </p>
          </div>

          <div className="p-5 bg-paper border-1.5 border-charcoal shadow-neo">
            <div className="w-9 h-9 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center mb-3">
              <Server size={18} />
            </div>
            <h3 className="font-serif font-bold text-charcoal text-base mb-1">Data Retention</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
              Reference images are retained during order fulfillment and deleted upon request post-completion.
            </p>
          </div>
        </div>

        <div className="bg-paper border-1.5 border-charcoal p-6 sm:p-10 shadow-neo space-y-8 text-charcoal">
          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              1. Information We Collect
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
              We collect information provided directly by you when submitting a commission inquiry, placing a shop order, or contacting the studio:
            </p>
            <ul className="list-disc list-inside text-xs text-charcoal/70 space-y-1 font-mono pl-2">
              <li>Identity &amp; Contact: Name, email address, phone number, delivery address.</li>
              <li>Commission Files: Reference photographs, wedding details, size specifications, and custom notes.</li>
              <li>Transaction Records: Order reference numbers and payment receipt IDs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              2. Data Processors &amp; Third-Party Services
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
              To operate our website and fulfill orders, we share necessary data with trusted infrastructure providers:
            </p>
            <ul className="list-disc list-inside text-xs text-charcoal/70 space-y-1 font-mono pl-2">
              {SITE_CONFIG.legal.dpdpDataProcessors.map((proc, i) => (
                <li key={i}>{proc}</li>
              ))}
              <li>Shipping &amp; Logistics: {SITE_CONFIG.shipping.courierPartners.join(", ")}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              3. Reference Photo Privacy &amp; Social Media
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
              We treat all uploaded family, couple, and heirloom reference photos as strictly confidential. We will only share photographs of finished custom portrait artwork on our portfolio or Instagram if you grant consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-serif font-bold border-b border-charcoal/15 pb-2">
              4. Data Subject Rights &amp; Grievance Redressal
            </h2>
            <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
              Under Indian e-commerce regulations and data protection standards, you have the right to request access to, correction of, or deletion of your personal data held by the studio.
            </p>
            <div className="p-4 bg-linen border border-charcoal/20 text-xs font-mono space-y-1">
              <p className="font-bold text-charcoal">Grievance Officer:</p>
              <p>{SITE_CONFIG.legal.grievanceOfficer} — {SITE_CONFIG.legal.entityName}</p>
              <p>Email: <a href={`mailto:${SITE_CONFIG.legal.grievanceEmail}`} className="text-terra underline">{SITE_CONFIG.legal.grievanceEmail}</a></p>
              <p>Address: {SITE_CONFIG.legal.grievanceAddress}</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
