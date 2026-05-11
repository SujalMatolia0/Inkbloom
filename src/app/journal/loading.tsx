import { JournalSkeleton } from "@/components/ui/Skeleton";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function JournalLoading() {
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-card-gap">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <JournalSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
