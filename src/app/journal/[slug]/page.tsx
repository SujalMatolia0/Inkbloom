import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";

export const revalidate = 60;

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = await prisma.post.findMany({
    where: {
      slug: { not: slug },
      published: true,
      tags: { hasSome: post.tags },
    },
    take: 3,
  });

  return (
    <div className="min-h-screen bg-linen">
      {/* Hero Section */}
      <div className="w-full h-[50vh] bg-charcoal/5 relative overflow-hidden">
        {post.coverImage && (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-linen via-linen/50 to-transparent" />
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Back Link */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/40 hover:text-terra transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Journal
        </Link>

        {/* Post Header */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold uppercase tracking-[0.1em] px-3 py-1 bg-terra/10 text-terra"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="font-serif text-[40px] md:text-[56px] font-bold text-charcoal leading-[1.05] tracking-[-0.02em] mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 text-[11px] text-charcoal/40 font-semibold uppercase tracking-[0.1em]">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {post.readTime} min read
            </div>
          </div>
        </div>

        {/* Post Body */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-charcoal prose-p:text-charcoal/80 prose-p:leading-relaxed prose-a:text-terra prose-strong:text-charcoal"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Share */}
        <div className="mt-12 pt-8 border-t border-charcoal/10 flex items-center gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/40">
            Share:
          </span>
          <button className="w-10 h-10 border border-charcoal/20 flex items-center justify-center hover:bg-terra hover:border-terra hover:text-linen transition-colors">
            <Share2 size={16} />
          </button>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-charcoal/10">
            <h2 className="font-serif text-[28px] font-bold text-charcoal mb-8">
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/journal/${related.slug}`}
                  className="group"
                >
                  <article className="border border-charcoal bg-linen overflow-hidden">
                    <div className="aspect-[16/9] bg-charcoal/5 flex items-center justify-center overflow-hidden">
                      {related.coverImage ? (
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-charcoal/20 text-[12px]">No cover</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-[16px] font-bold text-charcoal group-hover:text-terra transition-colors mb-2">
                        {related.title}
                      </h3>
                      <p className="text-[10px] text-charcoal/40 uppercase tracking-[0.1em] font-semibold">
                        {new Date(related.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
