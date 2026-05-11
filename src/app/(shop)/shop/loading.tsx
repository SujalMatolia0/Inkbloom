import { CardSkeleton } from "@/components/ui/Skeleton";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function ShopLoading() {
  return (
    <main className="min-h-screen bg-linen pt-[56px] flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-6 w-32 bg-charcoal/10 animate-pulse mb-4" />
            <div className="h-16 w-3/4 max-w-2xl bg-charcoal/10 animate-pulse" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-products gap-card-gap">
            {/* Featured Product Skeleton */}
            <div className="lg:row-span-2">
              <div className="border-1.5 border-charcoal bg-linen shadow-neo-te-lg h-full flex flex-col gap-4">
                <div className="w-full aspect-[4/5] bg-charcoal/20 animate-pulse flex-1" />
                <div className="p-6 space-y-4">
                  <div className="h-8 w-3/4 bg-charcoal/10 animate-pulse" />
                  <div className="h-6 w-1/2 bg-charcoal/10 animate-pulse" />
                  <div className="h-6 w-1/4 bg-charcoal/10 animate-pulse mt-4" />
                </div>
              </div>
            </div>

            {/* Regular Product Skeletons */}
            {[1, 2, 3, 4].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
