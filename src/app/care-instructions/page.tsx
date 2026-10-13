import { Metadata } from "next";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Sparkles, Sun, Droplets, ShieldCheck, Heart, Lightbulb, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "Artwork & Product Care Instructions | Vinyas Studio",
  description: "Care guidelines for LED bottle art, resin flower keepsakes, wood-slice platters, murti painting, charcoal portraits, and canvas art.",
};

export default function CareInstructionsPage() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      <section className="pt-24 pb-14 md:py-20 bg-charcoal text-linen flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/20 text-terra-pale border border-terra/30 text-[10px] uppercase font-mono tracking-widest mb-4">
            <Sparkles size={12} />
            <span>Preserving Studio Creations</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] font-bold mb-4">
            Product Care <em className="text-terra italic">Guide</em>
          </h1>
          <p className="text-xs sm:text-[14px] text-linen/70 max-w-xl mx-auto font-sans">
            Keep your LED bottle art, resin varmalas, murti paintings, and charcoal sketches pristine for years with these simple maintenance tips.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 flex-1 w-full space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LED Bottle Art & Hampers */}
          <div className="bg-paper border-1.5 border-charcoal p-6 shadow-neo space-y-4">
            <div className="w-10 h-10 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center">
              <Lightbulb size={20} />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal">Illuminated Bottle Art &amp; Hampers</h2>
            <ul className="text-xs text-charcoal/80 space-y-2 leading-relaxed font-sans">
              <li>• <strong>Water Care:</strong> Wipe glass exterior with a dry or slightly damp micro-fiber cloth. Do not immerse cork or battery module in water.</li>
              <li>• <strong>Battery Replacement:</strong> Uses standard LR44 button cells or AA batteries inside cork. Switch off when not in use to extend battery lifespan.</li>
            </ul>
          </div>

          {/* Resin Keepsakes */}
          <div className="bg-paper border-1.5 border-charcoal p-6 shadow-neo space-y-4">
            <div className="w-10 h-10 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center">
              <Droplets size={20} />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal">Resin Varmala &amp; Flower Preservation</h2>
            <ul className="text-xs text-charcoal/80 space-y-2 leading-relaxed font-sans">
              <li>• <strong>Sunlight Notice:</strong> Our resin uses premium UV inhibitors, but no resin is immune to extreme UV exposure. Keep away from direct harsh sunlight.</li>
              <li>• <strong>Cleaning:</strong> Clean with a soft micro-fiber cloth and warm soapy water if needed. Avoid abrasive scouring pads or harsh solvents.</li>
            </ul>
          </div>

          {/* Murti & Sacred Art */}
          <div className="bg-paper border-1.5 border-charcoal p-6 shadow-neo space-y-4">
            <div className="w-10 h-10 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center">
              <Flame size={20} />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal">Murti Painting &amp; Sacred Art</h2>
            <ul className="text-xs text-charcoal/80 space-y-2 leading-relaxed font-sans">
              <li>• <strong>Mandir Maintenance:</strong> Dust gently with a clean dry brush or cloth. Avoid applying alcohol, sanitizers, or harsh liquid cleaners over gold shringar work.</li>
            </ul>
          </div>

          {/* Wood-Slice Platters & Teak Frames */}
          <div className="bg-paper border-1.5 border-charcoal p-6 shadow-neo space-y-4">
            <div className="w-10 h-10 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center">
              <Heart size={20} />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal">Wood Platters &amp; Teak Frames</h2>
            <ul className="text-xs text-charcoal/80 space-y-2 leading-relaxed font-sans">
              <li>• <strong>Wood Polish:</strong> Natural teakwood and bark edges benefit from a light coat of natural beeswax or wood conditioner once a year to prevent drying.</li>
            </ul>
          </div>

          {/* Canvas & Mixed Media Paintings */}
          <div className="bg-paper border-1.5 border-charcoal p-6 shadow-neo space-y-4">
            <div className="w-10 h-10 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center">
              <Sun size={20} />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal">Canvas &amp; Mixed Media Paintings</h2>
            <ul className="text-xs text-charcoal/80 space-y-2 leading-relaxed font-sans">
              <li>• <strong>Dusting:</strong> Lightly dust with a soft feather duster. Keep away from damp or high-humidity interior walls.</li>
            </ul>
          </div>

          {/* Charcoal & Graphite Sketches */}
          <div className="bg-paper border-1.5 border-charcoal p-6 shadow-neo space-y-4">
            <div className="w-10 h-10 bg-terra/10 text-terra border border-terra/30 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h2 className="font-serif font-bold text-xl text-charcoal">Charcoal Heirloom Portraits</h2>
            <ul className="text-xs text-charcoal/80 space-y-2 leading-relaxed font-sans">
              <li>• <strong>Fixative Treated:</strong> Charcoal portraits are pre-sealed with archival fixative. Display framed behind glass to prevent paper yellowing.</li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
