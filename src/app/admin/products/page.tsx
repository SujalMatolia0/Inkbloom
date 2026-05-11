import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil, Package, Image as ImageIcon } from "lucide-react";
import { DeleteProductButton } from "@/components/ui/DeleteProductButton";
import { cn } from "@/theme/components";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
            Products
          </h1>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
            Manage your artwork
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="h-[44px] px-6 bg-terra text-linen font-bold text-[11px] uppercase tracking-[0.12em] flex items-center gap-2 hover:bg-terra-dark transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-deep2 border-1.5 border-charcoal/40 shadow-neo-ch overflow-hidden">
        {products.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-linen/5 flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-linen/20" />
            </div>
            <p className="text-[14px] text-linen/40 font-medium italic mb-6">No products found in the collection</p>
            <Link
              href="/admin/products/new"
              className="h-[40px] px-8 border border-terra text-terra font-bold text-[10px] uppercase tracking-[0.2em] inline-flex items-center hover:bg-terra hover:text-linen transition-all"
            >
              Curate First Artwork
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-charcoal/40 bg-linen/[0.02]">
                  <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-linen/30 p-6">
                    Artwork
                  </th>
                  <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-linen/30 p-6">
                    Medium
                  </th>
                  <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-linen/30 p-6">
                    Price
                  </th>
                  <th className="text-left text-[9px] font-bold uppercase tracking-[0.2em] text-linen/30 p-6">
                    Status
                  </th>
                  <th className="text-right text-[9px] font-bold uppercase tracking-[0.2em] text-linen/30 p-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/40">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-linen/[0.03] transition-colors group"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-deep border border-charcoal/60 p-1 group-hover:border-terra transition-colors">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-linen">
                            {product.title}
                          </p>
                          <p className="text-[10px] text-linen/30 uppercase tracking-[0.1em] mt-1 font-mono">
                            ID: {product.id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="text-[10px] font-bold text-linen/50 border border-charcoal/60 px-3 py-1.5 uppercase tracking-[0.1em]">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-[15px] font-bold text-terra">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          product.stock > 0 ? "bg-moss animate-pulse" : "bg-blush"
                        )}></div>
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-[0.15em]",
                            product.stock > 0 ? "text-moss" : "text-blush"
                          )}
                        >
                          {product.stock > 0 ? "Available" : "Sold Out"}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-10 h-10 border border-charcoal/60 flex items-center justify-center hover:border-terra hover:text-terra transition-all group/btn"
                        >
                          <Pencil size={14} className="text-linen/40 group-hover/btn:text-terra transition-colors" />
                        </Link>
                        <DeleteProductButton productId={product.id} />
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
