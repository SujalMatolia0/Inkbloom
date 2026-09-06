import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminCouponsManager } from "@/components/admin/AdminCouponsManager";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra-pale text-[9.5px] font-bold tracking-widest uppercase mb-3">
          <span>✦</span>
          <span>Studio Vinyas · Festival Promotions &amp; Sales</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-linen">
          Coupons &amp; Festive Sales
        </h1>
        <p className="text-xs text-linen/50 mt-1 max-w-xl font-sans">
          Configure seasonal discount campaigns for Diwali, Wedding Season, Navratri, Teej, and new collector offers. Codes apply directly at storefront checkout.
        </p>
      </div>

      <AdminCouponsManager initialCoupons={coupons} />
    </div>
  );
}
