import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { CommissionForm } from "./CommissionForm";

export const metadata: Metadata = {
  title: "Custom Art Commissions & Varmala Preservation | Vinyas Studio",
  description: "Commission custom resin varmala preservation, charcoal portraits, wall murals, and sacred murti art directly from Anki Matolia.",
};

export default function CommissionPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />
      <main className="flex-1">
        <CommissionForm />
      </main>
      <Footer />
    </div>
  );
}
