import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
export const dynamic = 'force-dynamic';
import { ChangePassword } from "@/components/profile/ChangePassword";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { CommissionHistory } from "@/components/profile/CommissionHistory";
import { User, Package, Image as ImageIcon } from "lucide-react";
import { LogoutButton } from "@/components/ui/LogoutButton";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 5, include: { items: true } },
      commissions: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  if (!user) {
    redirect("/login");
  }

  // Type the commissions properly
  const commissions = user.commissions.map(c => ({
    ...c,
    price: c.price ?? undefined,
  }));

  return (
    <div className="min-h-screen bg-linen">
      <Navbar />
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-28 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 sm:mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-terra flex items-center justify-center shrink-0">
              <User size={28} className="text-linen" />
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-[24px] sm:text-[28px] font-bold text-charcoal truncate">
                {user.name || "User"}
              </h1>
              <p className="text-[12px] text-charcoal/40 truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-charcoal/40 hover:text-terra transition-colors self-start sm:self-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="md:col-span-1">
            <div className="bg-linen border border-charcoal p-6">
              <h2 className="font-serif text-[18px] font-bold text-charcoal mb-4">
                Quick Links
              </h2>
              <div className="space-y-2">
                <Link
                  href="/shop"
                  className="flex items-center gap-3 p-3 text-[12px] text-charcoal hover:bg-charcoal/5 transition-colors"
                >
                  <Package size={16} />
                  Continue Shopping
                </Link>
                <Link
                  href="/portfolio"
                  className="flex items-center gap-3 p-3 text-[12px] text-charcoal hover:bg-charcoal/5 transition-colors"
                >
                  <ImageIcon size={16} />
                  View Portfolio
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Orders & Commissions */}
          <div className="md:col-span-2 space-y-8">
            {/* Order History */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-[24px] font-bold text-charcoal">
                  Recent Orders
                </h2>
                <Link
                  href="/profile/orders"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terra hover:underline"
                >
                  View All →
                </Link>
              </div>
              <OrderHistory orders={user.orders} />
            </section>

            {/* Commission History */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-[24px] font-bold text-charcoal">
                  Commissions
                </h2>
                <Link
                  href="/profile/commissions"
                  className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terra hover:underline"
                >
                  View All →
                </Link>
              </div>
              <CommissionHistory commissions={commissions} />
            </section>

            {/* Change Password */}
            <section>
              <h2 className="font-serif text-[24px] font-bold text-charcoal mb-6">
                Account Settings
              </h2>
              <ChangePassword />
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
