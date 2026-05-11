import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShoppingBag, FileText, Users, Currency } from "lucide-react";
import Link from "next/link";
import { cn } from "@/theme/components";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Fetch stats
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    totalCustomers,
    recentOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
  ]);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue._sum.total?.toFixed(2) || "0.00"}`,
      icon: Currency,
      color: "text-terra",
    },
    {
      label: "Total Orders",
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-moss",
    },
    {
      label: "Pending Orders",
      value: pendingOrders.toString(),
      icon: FileText,
      color: "text-blush",
    },
    {
      label: "Customers",
      value: totalCustomers.toString(),
      icon: Users,
      color: "text-terra",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
        Dashboard
      </h1>
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40 mb-8">
        Overview
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-deep2 border-1.5 border-charcoal/40 p-6 relative overflow-hidden group hover:border-terra/50 transition-colors shadow-neo-ch"
          >
            {/* Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-terra/20 group-hover:bg-terra transition-colors"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 bg-linen/5", stat.color)}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-linen/30">
                {stat.label}
              </span>
            </div>
            
            <p className="font-serif text-[32px] font-bold text-linen leading-none mb-1">
              {stat.value}
            </p>
            <div className="flex items-center gap-1.5 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-terra animate-pulse"></div>
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-linen/20">
                Live Data
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-deep2 border-1.5 border-charcoal/40 shadow-neo-ch overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-charcoal/40 bg-linen/2">
          <h2 className="font-serif text-[22px] font-bold text-linen">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-[10px] font-bold uppercase tracking-[0.15em] text-terra hover:text-terra-pale transition-colors flex items-center gap-2"
          >
            View All Orders
            <span className="text-[14px]">→</span>
          </Link>
        </div>

        <div className="divide-y divide-charcoal/40">
          {recentOrders.length === 0 ? (
            <div className="py-16 text-center">
              <ShoppingBag size={40} className="text-linen/10 mx-auto mb-3" />
              <p className="text-[13px] text-linen/30 font-medium italic">
                No orders processed yet
              </p>
            </div>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-6 hover:bg-linen/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-charcoal/60 flex items-center justify-center text-[10px] font-bold text-terra bg-deep group-hover:border-terra transition-colors">
                    #{order.id.slice(-4)}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-linen">
                      Customer ID: {order.userId.slice(0, 8)}...
                    </p>
                    <p className="text-[10px] text-linen/30 uppercase tracking-[0.1em] mt-1">
                      {order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[15px] font-bold text-linen mb-1">
                    ₹{order.total.toFixed(2)}
                  </p>
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1",
                      order.status === "DELIVERED"
                        ? "text-moss bg-moss/10"
                        : order.status === "PENDING"
                        ? "text-blush bg-blush/10"
                        : "text-terra bg-terra/10"
                    )}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
