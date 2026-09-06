import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateProduct } from "../../actions";
import { AdminProductForm } from "@/components/admin/AdminProductForm";

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

  const initialData = {
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category,
    images: product.images,
  };

  return (
    <div className="p-8 max-w-[850px]">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra-pale text-[9.5px] font-bold tracking-widest uppercase mb-3">
          <span>✦</span>
          <span>Studio Vinyas · Edit Artwork</span>
        </div>
        <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
          Edit Artwork
        </h1>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
          Update catalog & Cloudinary media for #{product.id.slice(-6)}
        </p>
      </div>

      <AdminProductForm
        initialData={initialData}
        action={updateProduct.bind(null, product.id)}
        isEditing={true}
      />
    </div>
  );
}
