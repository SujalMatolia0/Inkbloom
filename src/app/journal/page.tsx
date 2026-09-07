import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export const dynamic = 'force-dynamic';

export default async function JournalPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;

  const where: any = { published: true };
  if (tag) {
    where.tags = { hasSome: tag };
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const allTags = ["Process", "Behind the Scenes", "Tutorial", "New Collection", "Personal"];

  return (
    <div className="min-h-screen bg-linen flex flex-col selection:bg-terra selection:text-linen">
      <Navbar />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-24 pb-16 flex-1 w-full">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra text-[9.5px] font-bold tracking-widest uppercase mb-3">
            <span>✦</span>
            <span>Studio Journal &amp; Stories</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-[56px] font-bold text-charcoal tracking-tight mb-2">
            Journal
          </h1>
          <div className="w-16 h-1 bg-terra" />
        </div>

        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/journal"
            className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] border transition-colors ${
              !tag
                ? "bg-charcoal text-linen border-charcoal"
                : "bg-transparent text-charcoal/60 border-charcoal/20 hover:border-charcoal/40"
            }`}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={`/journal?tag=${encodeURIComponent(t)}`}
              className={`px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] border transition-colors ${
                tag === t
                  ? "bg-charcoal text-linen border-charcoal"
                  : "bg-transparent text-charcoal/60 border-charcoal/20 hover:border-charcoal/40"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[14px] text-charcoal/40">No posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/journal/${post.slug}`}
                className="group"
              >
                <article className="border border-charcoal bg-linen overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <div className="aspect-[16/9] bg-charcoal/5 flex items-center justify-center overflow-hidden">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-charcoal/20 text-[14px]">No cover</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-1 text-[10px] text-charcoal/40 font-semibold uppercase tracking-[0.1em]">
                        <Calendar size={12} />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-charcoal/40 font-semibold uppercase tracking-[0.1em]">
                        <Clock size={12} />
                        {post.readTime} min read
                      </div>
                    </div>
                    <h2 className="font-serif text-[20px] font-bold text-charcoal mb-3 group-hover:text-terra transition-colors">
                      {post.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold uppercase tracking-[0.1em] px-2 py-1 border border-charcoal/20 text-charcoal/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
