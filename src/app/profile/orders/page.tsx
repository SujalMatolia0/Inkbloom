import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShoppingBag, Truck, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export default async function ProfileOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const statusConfig: Record<string, { color: string; icon: any }> = {
    PENDING: { color: "text-blush", icon: ShoppingBag },
    IN_PROGRESS: { color: "text-terra", icon: Truck },
    SHIPPED: { color: "text-moss", icon: Truck },
    DELIVERED: { color: "text-moss", icon: CheckCircle2 },
    CANCELLED: { color: "text-charcoal/40", icon: XCircle },
  };

  return (
    <div className="min-h-screen bg-linen">
      <div className="max-w-[1100px] mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-[36px] font-bold text-charcoal">
            My Orders
          </h1>
          <Link
            href="/profile"
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terra hover:underline"
          >
            ← Back to Profile
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-linen border border-charcoal p-12 text-center">
            <ShoppingBag size={48} className="text-charcoal/20 mx-auto mb-4" />
            <p className="text-[14px] text-charcoal/40 mb-6">No orders yet</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 h-[44px] px-6 bg-charcoal text-linen text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-charcoal/90"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status]?.icon || ShoppingBag;
              return (
                <div
                  key={order.id}
                  className="bg-linen border border-charcoal p-6 hover:border-terra transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[12px] font-semibold text-charcoal">
                        Order #{order.id.slice(-8)}
                      </p>
                      <p className="text-[10px] text-charcoal/40 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[16px] font-bold text-terra">
                        ₹{order.total.toFixed(2)}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] px-3 py-1 ${
                          statusConfig[order.status]?.color || "text-charcoal/40"
                        }`}
                      >
                        <StatusIcon size={12} />
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-charcoal/10 pt-4 mt-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-3">
                      Items
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <p className="text-[12px] text-charcoal">
                            {item.quantity}x Item #{item.productId.slice(-6)}
                          </p>
                          <p className="text-[12px] text-charcoal/60">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
