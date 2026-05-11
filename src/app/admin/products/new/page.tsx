import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createProduct } from "../actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const categories = ["Original", "Print", "Illustration", "Commission"];

  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-8">
        <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
          New Product
        </h1>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
          Add artwork to your shop
        </p>
      </div>

      <form action={createProduct} className="space-y-6">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Title
          </label>
          <Input
            name="title"
            required
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
            placeholder="Midnight Doodle"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
              Slug
            </label>
            <Input
              name="slug"
              required
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
              placeholder="midnight-doodle"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
              Category
            </label>
            <select
              name="category"
              required
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen focus:border-terra text-[13px]"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
              Price (₹)
            </label>
            <Input
              name="price"
              type="number"
              step="0.01"
              required
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
              placeholder="250"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
              Stock
            </label>
            <Input
              name="stock"
              type="number"
              required
              defaultValue="1"
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Description
          </label>
          <Textarea
            name="description"
            required
            rows={4}
            className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-[13px]"
            placeholder="Describe your artwork..."
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Image URLs (one per line)
          </label>
          <Textarea
            name="images"
            rows={3}
            className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-[13px] font-mono"
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="h-[48px] px-8 bg-terra text-linen font-bold text-[11px] uppercase tracking-[0.12em] hover:bg-terra-dark transition-colors"
          >
            Create Product
          </button>
          <a
            href="/admin/products"
            className="h-[48px] px-8 border border-linen/10 text-linen font-bold text-[11px] uppercase tracking-[0.12em] flex items-center hover:bg-linen/5 transition-colors"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
