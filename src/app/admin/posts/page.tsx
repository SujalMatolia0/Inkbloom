import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff } from "lucide-react";
import { deletePost } from "./actions";
import { DeletePostButton } from "@/components/ui/DeletePostButton";

export default async function AdminJournalPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { published } = await searchParams;

  if (!session?.user?.email) {
    redirect("/login");
  }

  const where = published === "false" ? { published: false } : { published: true };
  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
            Journal
          </h1>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
            Manage blog posts
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="h-[44px] px-6 bg-terra text-linen font-bold text-[11px] uppercase tracking-[0.12em] flex items-center gap-2 hover:bg-terra-dark transition-colors"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <Link
          href="/admin/journal"
          className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] border transition-colors ${
            !published
              ? "bg-terra text-linen border-terra"
              : "bg-transparent text-linen/60 border-linen/10 hover:bg-linen/5"
          }`}
        >
          Published
        </Link>
        <Link
          href="/admin/journal?published=false"
          className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] border transition-colors ${
            published === "false"
              ? "bg-terra text-linen border-terra"
              : "bg-transparent text-linen/60 border-linen/10 hover:bg-linen/5"
          }`}
        >
          Drafts
        </Link>
      </div>

      {/* Posts Table */}
      <div className="bg-deep2 border border-linen/10">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <FileText size={48} className="text-linen/20 mx-auto mb-4" />
            <p className="text-[14px] text-linen/40">No posts yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-linen/10">
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Title
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Status
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Date
                  </th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-linen/5 hover:bg-linen/5 transition-colors">
                    <td className="p-4">
                      <p className="text-[13px] font-semibold text-linen">{post.title}</p>
                      <p className="text-[10px] text-linen/40 mt-1">{post.slug}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] px-3 py-1 ${
                          post.published
                            ? "bg-moss/20 text-moss"
                            : "bg-blush/20 text-blush"
                        }`}
                      >
                        {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-[11px] text-linen/40">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/journal/${post.id}/edit`}
                          className="w-9 h-9 border border-linen/10 flex items-center justify-center hover:bg-linen/10 transition-colors"
                        >
                          <Pencil size={14} className="text-linen/60" />
                        </Link>
                        <DeletePostButton postId={post.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
