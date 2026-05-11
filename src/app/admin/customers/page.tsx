import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Users, ShoppingBag, Trophy } from "lucide-react";

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      orders: { select: { id: true, total: true, status: true } },
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
          Customers
        </h1>
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
          Manage registered users
        </p>
      </div>

      {/* Customers Table */}
      <div className="bg-deep2 border border-linen/10">
        {customers.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={48} className="text-linen/20 mx-auto mb-4" />
            <p className="text-[14px] text-linen/40">No customers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-linen/10">
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Customer
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Orders
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Total Spent
                  </th>
                  <th className="text-left text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 p-4">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => {
                  const totalSpent = customer.orders.reduce(
                    (sum: number, order: any) => sum + order.total,
                    0
                  );
                  return (
                    <tr
                      key={customer.id}
                      className="border-b border-linen/5 hover:bg-linen/5 transition-colors"
                    >
                      <td className="p-4">
                        <div>
                          <p className="text-[12px] font-semibold text-linen">
                            {customer.name || "N/A"}
                          </p>
                          <p className="text-[10px] text-linen/40">
                            {customer.email}
                          </p>
                        </div>
                      </td>
                  <td className="p-4">
                        <span className="text-[11px] text-linen/60 bg-linen/5 px-3 py-1">
                          {customer.orders.length} order(s)
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[13px] font-bold text-terra">
                          ₹{totalSpent.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] text-linen/40">
                          N/A
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[13px] font-bold text-terra">
                          ₹{totalSpent.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-[10px] text-linen/40">
                          N/A
                        </span>
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
