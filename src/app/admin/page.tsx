import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  ShoppingBag, 
  FileText, 
  Users, 
  Palette,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Plus
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/theme/components";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Fetch comprehensive studio stats
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    totalCommissions,
    pendingCommissions,
    totalCustomers,
    recentOrders,
    recentCommissions,
    totalRevenue,
    categoryGroups,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.commission.count(),
    prisma.commission.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } }, user: true },
    }),
    prisma.commission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.product.groupBy({
      by: ["category"],
      _count: { id: true },
    }),
  ]);

  const catMap = Object.fromEntries(categoryGroups.map((g) => [g.category, g._count.id]));

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${(totalRevenue._sum.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`,
      icon: ShoppingBag,
      color: "text-terra",
      sub: `${totalOrders} orders completed`,
    },
    {
      label: "Studio Artworks",
      value: totalProducts.toString(),
      icon: Palette,
      color: "text-moss",
      sub: "Active in online catalog",
    },
    {
      label: "Custom Commissions",
      value: totalCommissions.toString(),
      icon: MessageSquare,
      color: "text-terra-pale",
      sub: `${pendingCommissions} awaiting review`,
    },
    {
      label: "Registered Clients",
      value: totalCustomers.toString(),
      icon: Users,
      color: "text-blush",
      sub: "Art collectors & buyers",
    },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra-pale text-[9.5px] font-bold tracking-widest uppercase mb-3">
            <span>✦</span>
            <span>Studio Vinyas · Admin Dashboard</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-linen">
            Studio Overview
          </h1>
          <p className="text-xs text-linen/50 mt-1">
            Real-time management of Anki Matolia&apos;s artworks, commissions, orders, and inquiries.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/products/new"
            className="px-4 py-2.5 bg-terra hover:bg-terra-dark text-linen text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.6)]"
          >
            <Plus size={14} />
            <span>Add Artwork</span>
          </Link>
          <Link
            href="/shop"
            target="_blank"
            className="px-4 py-2.5 bg-deep2 hover:bg-deep text-linen/80 hover:text-linen text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-charcoal/60 transition-all"
          >
            <span>Live Shop</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-deep2 border border-charcoal/40 p-6 relative overflow-hidden group hover:border-terra/50 transition-colors shadow-neo-ch"
          >
            <div className="absolute top-0 left-0 w-full h-[2px] bg-terra/20 group-hover:bg-terra transition-colors"></div>
            
            <div className="flex items-center justify-between mb-3">
              <div className={cn("p-2 bg-linen/5", stat.color)}>
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-linen/40">
                {stat.label}
              </span>
            </div>
            
            <p className="font-serif text-3xl font-bold text-linen leading-none mb-2">
              {stat.value}
            </p>
            <p className="text-[10px] text-linen/40 font-mono">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Studio Collection Categories Breakdown */}
      <div className="bg-deep2 border border-charcoal/40 p-6 shadow-neo-ch">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-charcoal/40">
          <div>
            <h2 className="font-serif text-lg font-bold text-linen">
              Catalog Mediums Distribution
            </h2>
            <p className="text-[11px] text-linen/40 font-sans">
              Curated Studio Vinyas works across 4 distinct disciplines
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-[10px] font-bold uppercase tracking-wider text-terra hover:text-terra-pale transition-colors flex items-center gap-1.5"
          >
            <span>Manage All Artworks</span>
            <ArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-deep/60 border border-charcoal/60">
            <div className="text-[9.5px] font-bold uppercase tracking-widest text-blue-300/80 mb-1">
              Sketch &amp; Portraits
            </div>
            <div className="font-serif text-2xl font-bold text-linen">
              {catMap["Sketch"] || 0}
            </div>
            <div className="text-[9.5px] text-linen/40 mt-1 font-mono">
              Graphite &amp; Charcoal
            </div>
          </div>

          <div className="p-4 bg-deep/60 border border-charcoal/60">
            <div className="text-[9.5px] font-bold uppercase tracking-widest text-terra mb-1">
              Canvas Paintings
            </div>
            <div className="font-serif text-2xl font-bold text-linen">
              {catMap["Canvas"] || 0}
            </div>
            <div className="text-[9.5px] text-linen/40 mt-1 font-mono">
              Acrylic &amp; Heritage
            </div>
          </div>

          <div className="p-4 bg-deep/60 border border-charcoal/60">
            <div className="text-[9.5px] font-bold uppercase tracking-widest text-amber-300/80 mb-1">
              Wall Art &amp; Murals
            </div>
            <div className="font-serif text-2xl font-bold text-linen">
              {catMap["Wall Art"] || 0}
            </div>
            <div className="text-[9.5px] text-linen/40 mt-1 font-mono">
              Cafe &amp; Temple Murals
            </div>
          </div>

          <div className="p-4 bg-deep/60 border border-charcoal/60">
            <div className="text-[9.5px] font-bold uppercase tracking-widest text-emerald-300/80 mb-1">
              Craft &amp; Keepsakes
            </div>
            <div className="font-serif text-2xl font-bold text-linen">
              {catMap["Craft"] || 0}
            </div>
            <div className="text-[9.5px] text-linen/40 mt-1 font-mono">
              Resin, Bottles &amp; Platters
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Orders & Recent Commissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-deep2 border border-charcoal/40 shadow-neo-ch overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-charcoal/40 bg-linen/[0.02]">
            <h2 className="font-serif text-lg font-bold text-linen">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-[10.5px] font-bold uppercase tracking-wider text-terra hover:text-terra-pale transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          <div className="divide-y divide-charcoal/40">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-linen/30 text-xs italic">
                No orders placed yet.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-linen/[0.02] transition-colors flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-linen">
                      #{order.id.slice(-6)} · {order.user?.name || "Anonymous Client"}
                    </p>
                    <p className="text-[10px] text-linen/40 font-mono mt-0.5">
                      {order.items.length} piece(s) · {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-xs text-terra">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                    <span className="text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 mt-0.5 inline-block bg-linen/10 text-linen/70">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Commissions */}
        <div className="bg-deep2 border border-charcoal/40 shadow-neo-ch overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-charcoal/40 bg-linen/[0.02]">
            <h2 className="font-serif text-lg font-bold text-linen">
              Recent Commission Requests
            </h2>
            <Link
              href="/admin/commissions"
              className="text-[10.5px] font-bold uppercase tracking-wider text-terra hover:text-terra-pale transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={11} />
            </Link>
          </div>

          <div className="divide-y divide-charcoal/40">
            {recentCommissions.length === 0 ? (
              <div className="py-12 text-center text-linen/30 text-xs italic">
                No custom commission requests yet.
              </div>
            ) : (
              recentCommissions.map((comm) => (
                <div key={comm.id} className="p-4 hover:bg-linen/[0.02] transition-colors flex items-center justify-between gap-3">
                  <div className="max-w-[240px]">
                    <p className="text-xs font-bold text-linen line-clamp-1">
                      {comm.user.name || "Client"}
                    </p>
                    <p className="text-[10px] text-linen/40 line-clamp-1 mt-0.5">
                      {comm.instructions || "Custom artwork request"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif font-bold text-xs text-terra">
                      {comm.price ? `₹${comm.price.toLocaleString("en-IN")}` : "Bespoke Quote"}
                    </p>
                    <span className="text-[8.5px] font-bold uppercase tracking-widest px-2 py-0.5 mt-0.5 inline-block bg-terra/20 text-terra-pale">
                      {comm.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
