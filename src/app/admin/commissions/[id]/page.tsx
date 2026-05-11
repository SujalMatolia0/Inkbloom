import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar, Palette, Tag, CheckSquare } from "lucide-react";
import { updateCommissionStatus } from "../actions";
import { StatusSelect } from "@/components/ui/StatusSelect";

export default async function AdminCommissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  const commission = await prisma.commission.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!commission) {
    notFound();
  }

  return (
    <div className="p-8">
      <Link
        href="/admin/commissions"
        className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-linen/60 hover:text-terra mb-8"
      >
        <ArrowLeft size={14} /> Back to Commissions
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-[36px] font-bold text-linen mb-2">
            Commission Request
          </h1>
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-linen/40">
            #{commission.id}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 text-right">
            Update Status
          </label>
          <StatusSelect
            id={commission.id}
            defaultValue={commission.status}
            action={updateCommissionStatus}
            className="bg-deep2 border border-linen/20 text-linen text-[12px] font-bold uppercase tracking-[0.1em] px-4 py-2 outline-none focus:border-terra cursor-pointer"
            options={[
              { value: "PENDING", label: "Pending Review" },
              { value: "REVIEWING", label: "Reviewing" },
              { value: "ACCEPTED", label: "Accepted" },
              { value: "REJECTED", label: "Rejected" },
              { value: "IN_PROGRESS", label: "In Progress" },
              { value: "COMPLETED", label: "Completed" },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col - Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-deep2 border border-linen/10 p-8">
            <h2 className="font-serif text-[24px] font-bold text-linen mb-6 border-b border-linen/10 pb-4">
              Request Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 mb-2 flex items-center gap-2">
                  <Palette size={14} /> Instructions
                </p>
                <p className="text-[14px] text-linen leading-relaxed whitespace-pre-wrap">
                  {commission.instructions}
                </p>
              </div>
            </div>
          </div>

          {/* Reference Image (If Any) */}
          {commission.referenceImg && (
            <div className="bg-deep2 border border-linen/10 p-8">
              <h2 className="font-serif text-[20px] font-bold text-linen mb-6">
                Reference Material
              </h2>
              <div className="relative aspect-video max-w-full overflow-hidden border border-linen/10 bg-deep/50">
                <img
                  src={commission.referenceImg}
                  alt="Reference"
                  className="w-full h-full object-contain"
                />
              </div>
              <a
                href={commission.referenceImg}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-terra hover:underline"
              >
                View Full Size →
              </a>
            </div>
          )}
        </div>

        {/* Right Col - Meta */}
        <div className="space-y-6">
          <div className="bg-deep2 border border-linen/10 p-6">
            <h3 className="font-serif text-[18px] font-bold text-linen mb-4">
              Client Info
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-terra/20 flex items-center justify-center">
                  <User size={14} className="text-terra" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-linen">{commission.user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-linen/5 flex items-center justify-center">
                  <Mail size={14} className="text-linen/60" />
                </div>
                <div>
                  <p className="text-[12px] text-linen/60">{commission.user.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-deep2 border border-linen/10 p-6">
            <h3 className="font-serif text-[18px] font-bold text-linen mb-4">
              Parameters
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 mb-1 flex items-center gap-2">
                  <Tag size={12} /> Price
                </p>
                <p className="text-[13px] font-bold text-linen">{commission.price ? `₹${commission.price}` : 'TBD'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-linen/40 mb-1 flex items-center gap-2">
                  <Calendar size={12} /> Date Requested
                </p>
                <p className="text-[13px] font-bold text-linen">
                  {new Date(commission.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
