import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FaqSection } from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Vinyas Studio",
  description: "Find answers about custom commissions, resin varmala preservation, wall murals, framing, shipping, and turnaround times.",
};

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />
      <main className="flex-1 pt-12">
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
