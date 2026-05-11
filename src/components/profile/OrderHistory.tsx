import { ShoppingBag, Truck, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: Date;
  items: { id: string }[];
}

const statusConfig: Record<string, { color: string; icon: any }> = {
  PENDING: { color: "text-blush", icon: ShoppingBag },
  IN_PROGRESS: { color: "text-terra", icon: Truck },
  SHIPPED: { color: "text-moss", icon: Truck },
  DELIVERED: { color: "text-moss", icon: CheckCircle2 },
  CANCELLED: { color: "text-charcoal/40", icon: XCircle },
};

export function OrderHistory({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="bg-linen border border-charcoal p-8 text-center">
        <ShoppingBag size={32} className="text-charcoal/20 mx-auto mb-3" />
        <p className="text-[13px] text-charcoal/40 mb-4">No orders yet</p>
        <Link
          href="/shop"
          className="text-[11px] font-bold uppercase tracking-[0.12em] text-terra hover:underline"
        >
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const StatusIcon = statusConfig[order.status]?.icon || ShoppingBag;
        return (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 bg-linen border border-charcoal hover:border-terra transition-colors"
          >
            <div>
              <p className="text-[12px] font-semibold text-charcoal">
                #{order.id.slice(-8)}
              </p>
              <p className="text-[10px] text-charcoal/40 mt-1">
                {order.items.length} item(s) • {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-bold text-terra">
                ₹{order.total.toFixed(2)}
              </p>
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.1em] flex items-center gap-1 justify-end ${
                  statusConfig[order.status]?.color || "text-charcoal/40"
                }`}
              >
                <StatusIcon size={12} />
                {order.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
