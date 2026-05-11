import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createPost } from "../actions";
import { Textarea } from "@/components/ui/Textarea";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  return (
    <div className="p-8 max-w-[900px]">
      <div className="mb-8">
        <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
          New Post
        </h1>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
          Create journal entry
        </p>
      </div>

      <form action={createPost} className="space-y-6">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Title
          </label>
          <input
            name="title"
            required
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:outline-none focus:border-terra"
            placeholder="How I built my colour palette"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
              Slug
            </label>
            <input
              name="slug"
              required
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:outline-none focus:border-terra"
              placeholder="colour-palette"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
              Read Time (minutes)
            </label>
            <input
              name="readTime"
              type="number"
              defaultValue="5"
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen focus:outline-none focus:border-terra"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Cover Image URL
          </label>
          <input
            name="coverImage"
            required
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:outline-none focus:border-terra font-mono text-[11px]"
            placeholder="https://example.com/cover.jpg"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Tags (comma separated)
          </label>
          <input
            name="tags"
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:outline-none focus:border-terra"
            placeholder="Process, Behind the Scenes, Tutorial"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Body (HTML)
          </label>
          <Textarea
            name="body"
            required
            rows={12}
            className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:outline-none focus:border-terra font-mono text-[12px] leading-relaxed"
            placeholder="<p>Write your post content here...</p>"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="published"
              className="w-4 h-4 border-linen/20 bg-deep2 rounded"
            />
            <span className="text-[11px] text-linen/60">Publish immediately</span>
          </label>

          <div className="flex gap-4">
            <a
              href="/admin/journal"
              className="h-[48px] px-8 border border-linen/10 text-linen font-bold text-[11px] uppercase tracking-[0.12em] flex items-center hover:bg-linen/5 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="h-[48px] px-8 bg-terra text-linen font-bold text-[11px] uppercase tracking-[0.12em] hover:bg-terra-dark transition-colors"
            >
              Create Post
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
