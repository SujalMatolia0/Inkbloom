import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateProduct } from "../../actions";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session?.user?.email) {
    redirect("/login");
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    redirect("/admin/products");
  }

  const categories = ["Original", "Print", "Illustration", "Commission"];

  return (
    <div className="p-8 max-w-[800px]">
      <div className="mb-8">
        <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
          Edit Product
        </h1>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
          Update artwork details
        </p>
      </div>

      <form action={updateProduct.bind(null, product.id)} className="space-y-6">
        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Title
          </label>
          <Input
            name="title"
            required
            defaultValue={product.title}
            className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
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
              defaultValue={product.slug}
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
            />
          </div>
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
              Category
            </label>
            <select
              name="category"
              required
              defaultValue={product.category}
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen focus:border-terra text-[13px]"
            >
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
              defaultValue={product.price}
              className="w-full h-[48px] px-4 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra"
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
              defaultValue={product.stock}
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
            defaultValue={product.description}
            className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-[13px]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/60 mb-2">
            Image URLs (one per line)
          </label>
          <Textarea
            name="images"
            rows={3}
            defaultValue={product.images.join("\n")}
            className="w-full px-4 py-3 bg-deep2 border border-linen/10 text-linen placeholder:text-linen/30 focus:border-terra text-[13px] font-mono"
          />
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            className="h-[48px] px-8 bg-terra text-linen font-bold text-[11px] uppercase tracking-[0.12em] hover:bg-terra-dark transition-colors"
          >
            Update Product
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
