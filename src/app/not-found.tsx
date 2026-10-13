import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Compass, ArrowLeft, Home, Palette, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-24 md:py-32">
        <div className="max-w-xl w-full text-center space-y-8 bg-paper border-1.5 border-charcoal p-8 sm:p-12 shadow-neo">
          <div className="w-16 h-16 bg-terra/10 border-1.5 border-charcoal text-terra flex items-center justify-center mx-auto">
            <Compass size={32} />
          </div>

          <div>
            <span className="font-mono text-xs font-bold text-terra uppercase tracking-widest block mb-2">
              Error 404 · Page Not Found
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal tracking-tight">
              Lost in the <em className="text-terra italic">Gallery?</em>
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/70 mt-3 font-sans leading-relaxed">
              The page or canvas you were looking for doesn&apos;t exist or has been moved to a new collection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="/"
              className="px-4 py-3 bg-charcoal text-linen font-mono text-xs font-bold uppercase tracking-wider hover:bg-terra transition-colors flex items-center justify-center gap-1.5"
            >
              <Home size={14} />
              <span>Homepage</span>
            </Link>
            <Link
              href="/portfolio"
              className="px-4 py-3 bg-paper border-1.5 border-charcoal text-charcoal font-mono text-xs font-bold uppercase tracking-wider hover:bg-linen transition-colors flex items-center justify-center gap-1.5"
            >
              <Palette size={14} />
              <span>3D Gallery</span>
            </Link>
            <Link
              href="/shop"
              className="px-4 py-3 bg-paper border-1.5 border-charcoal text-charcoal font-mono text-xs font-bold uppercase tracking-wider hover:bg-linen transition-colors flex items-center justify-center gap-1.5"
            >
              <ShoppingBag size={14} />
              <span>Art Shop</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-charcoal/10 text-xs font-mono text-charcoal/50">
            Need custom help? <Link href="/contact" className="text-terra underline font-bold">Contact Studio Support</Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
