import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { updateOrderStatus, processAdminRefund } from "./actions";
import { ShoppingBag, Truck, CheckCircle2, XCircle } from "lucide-react";

const statusConfig = {
  PENDING: { label: "Pending", color: "text-blush", bg: "bg-blush/10", icon: ShoppingBag },
  PAID: { label: "Paid", color: "text-emerald-400", bg: "bg-emerald-400/10", icon: CheckCircle2 },
  IN_PROGRESS: { label: "In Progress", color: "text-terra", bg: "bg-terra/10", icon: Truck },
  SHIPPED: { label: "Shipped", color: "text-moss", bg: "bg-moss/10", icon: Truck },
  DELIVERED: { label: "Delivered", color: "text-moss", bg: "bg-moss/10", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "text-linen/40", bg: "bg-linen/5", icon: XCircle },
  REFUND_REQUIRED: { label: "Refund Required", color: "text-rose-400", bg: "bg-rose-400/10", icon: XCircle },
  REFUND_PENDING: { label: "Refund Pending", color: "text-amber-400", bg: "bg-amber-400/10", icon: Truck },
  REFUNDED: { label: "Refunded", color: "text-amber-400", bg: "bg-amber-400/10", icon: CheckCircle2 },
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const { status } = await searchParams;

  if (!session?.user?.email) {
    redirect("/login");
  }

  const where = status ? { status: status as any } : {};
  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } }, user: true },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-terra/10 border border-terra/30 text-terra-pale text-[9.5px] font-bold tracking-widest uppercase mb-3">
          <span>✦</span>
          <span>Studio Vinyas · Client Orders</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-linen mb-1">
          Studio Orders
        </h1>
        <p className="text-xs text-linen/50">
          Track fulfillment and delivery of original artworks and keepsakes
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 mb-6">
        <a
          href="/admin/orders"
          className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] border transition-colors ${
            !status ? "bg-terra text-linen border-terra" : "bg-transparent text-linen/60 border-linen/10 hover:bg-linen/5"
          }`}
        >
          All
        </a>
        {Object.entries(statusConfig).map(([key, config]) => (
          <a
            key={key}
            href={`/admin/orders?status=${key}`}
            className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] border transition-colors ${
              status === key ? "bg-terra text-linen border-terra" : "bg-transparent text-linen/60 border-linen/10 hover:bg-linen/5"
            }`}
          >
            {config.label}
          </a>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-deep2 border border-linen/10">
        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <ShoppingBag size={48} className="text-linen/20 mx-auto mb-4" />
            <p className="text-[14px] text-linen/40">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-linen/10">
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Order ID
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Customer
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Items
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Total
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Status
                  </th>
                  <th className="text-right text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon;
                  return (
                    <tr key={order.id} className="border-b border-linen/5 hover:bg-linen/5 transition-colors">
                      <td className="p-4">
                        <span className="text-[12px] font-semibold text-linen">
                          #{order.id.slice(-8)}
                        </span>
                        <p className="text-[10px] text-linen/40 mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-[12px] text-linen">
                          {order.user?.name || "Guest"}
                        </p>
                        <p className="text-[10px] text-linen/40">
                          {order.user?.email || "N/A"}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-[12px] text-linen/60">
                          {order.items.length} item(s)
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="text-[13px] font-bold text-terra">
                          ₹{order.total.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${statusConfig[order.status].color} ${statusConfig[order.status].bg}`}>
                          <StatusIcon size={12} />
                          {statusConfig[order.status].label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {(order.status === "PAID" || order.status === "PENDING") && (
                            <form action={updateOrderStatus.bind(null, order.id, "IN_PROGRESS")}>
                              <button
                                type="submit"
                                className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-terra text-linen hover:bg-terra-dark transition-colors cursor-pointer"
                              >
                                Start
                              </button>
                            </form>
                          )}
                          {order.status === "REFUND_REQUIRED" && (
                            <form action={processAdminRefund.bind(null, order.id)}>
                              <button
                                type="submit"
                                className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-rose-700 text-linen hover:bg-rose-800 transition-colors cursor-pointer"
                              >
                                Issue Refund
                              </button>
                            </form>
                          )}
                          {order.status === "IN_PROGRESS" && (
                            <form action={updateOrderStatus.bind(null, order.id, "SHIPPED")}>
                              <button
                                type="submit"
                                className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-moss text-linen hover:opacity-90 transition-colors cursor-pointer"
                              >
                                Ship
                              </button>
                            </form>
                          )}
                          {order.status === "SHIPPED" && (
                            <form action={updateOrderStatus.bind(null, order.id, "DELIVERED")}>
                              <button
                                type="submit"
                                className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] bg-moss text-linen hover:opacity-90 transition-colors cursor-pointer"
                              >
                                Deliver
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
