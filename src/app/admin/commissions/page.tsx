import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { updateCommissionStatus } from "./actions";
import { StatusSelect } from "@/components/ui/StatusSelect";

export default async function AdminCommissionsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const commissions = await prisma.commission.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
            Commissions
          </h1>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
            Manage custom artwork requests
          </p>
        </div>
      </div>

      <div className="bg-deep2 border border-linen/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-linen/10 bg-deep/50">
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40">
                  ID
                </th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40">
                  Client
                </th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40">
                  Type / Subject
                </th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40">
                  Date
                </th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40">
                  Status
                </th>
                <th className="p-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen/10">
              {commissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-[13px] text-linen/40"
                  >
                    No commission requests found.
                  </td>
                </tr>
              ) : (
                commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-deep/30 transition-colors">
                    <td className="p-4 text-[12px] font-semibold text-linen">
                      #{commission.id.slice(-8)}
                    </td>
                    <td className="p-4">
                      <p className="text-[13px] font-bold text-linen">
                        {commission.user.name}
                      </p>
                      <p className="text-[11px] text-linen/60">
                        {commission.user.email}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-[13px] font-bold text-linen">
                        {commission.price ? `₹${commission.price}` : "Unpriced"}
                      </p>
                      <p className="text-[11px] text-linen/60 truncate max-w-[200px]">
                        {commission.instructions}
                      </p>
                    </td>
                    <td className="p-4 text-[12px] text-linen/60">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <StatusSelect
                        id={commission.id}
                        defaultValue={commission.status}
                        action={updateCommissionStatus}
                        options={[
                          { value: "PENDING", label: "Pending" },
                          { value: "REVIEWING", label: "Reviewing" },
                          { value: "ACCEPTED", label: "Accepted" },
                          { value: "REJECTED", label: "Rejected" },
                          { value: "IN_PROGRESS", label: "In Progress" },
                          { value: "COMPLETED", label: "Completed" },
                        ]}
                      />
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/commissions/${commission.id}`}
                        className="text-[11px] font-semibold uppercase tracking-[0.1em] text-terra hover:text-terra/80"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
