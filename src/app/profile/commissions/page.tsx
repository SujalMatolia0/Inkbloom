import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default async function ProfileCommissionsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const commissions = await prisma.commission.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  const statusConfig: Record<string, { color: string; icon: any }> = {
    PENDING: { color: "text-blush", icon: Clock },
    REVIEWING: { color: "text-terra", icon: FileText },
    ACCEPTED: { color: "text-moss", icon: CheckCircle2 },
    REJECTED: { color: "text-charcoal/40", icon: XCircle },
    IN_PROGRESS: { color: "text-terra", icon: FileText },
    COMPLETED: { color: "text-moss", icon: CheckCircle2 },
  };

  return (
    <div className="min-h-screen bg-linen flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 pt-28 pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h1 className="font-serif text-[28px] sm:text-[36px] font-bold text-charcoal">
              My Commissions
            </h1>
            <Link
              href="/profile"
              className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terra hover:underline"
            >
              ← Back to Profile
            </Link>
          </div>

          {commissions.length === 0 ? (
            <div className="bg-linen border border-charcoal p-8 sm:p-12 text-center">
              <FileText size={48} className="text-charcoal/20 mx-auto mb-4" />
              <p className="text-[14px] text-charcoal/40 mb-6">No commissions yet</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-[44px] px-6 bg-charcoal text-linen text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-charcoal/90 transition-colors"
              >
                Request Commission
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {commissions.map((commission) => {
                const StatusIcon = statusConfig[commission.status]?.icon || FileText;
                return (
                  <div
                    key={commission.id}
                    className="bg-linen border border-charcoal p-5 sm:p-6 hover:border-terra transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div>
                        <p className="text-[12px] font-semibold text-charcoal">
                          Commission #{commission.id.slice(-8)}
                        </p>
                        <p className="text-[10px] text-charcoal/40 mt-1">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center sm:flex-col sm:items-end justify-between gap-2">
                        {commission.price && (
                          <p className="text-[16px] font-bold text-terra">
                            ₹{commission.price.toFixed(2)}
                          </p>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.1em] px-2.5 py-0.5 sm:px-3 sm:py-1 ${
                            statusConfig[commission.status]?.color || "text-charcoal/40"
                          }`}
                        >
                          <StatusIcon size={12} />
                          {commission.status}
                        </span>
                      </div>
                    </div>

                    {/* Commission Details */}
                    <div className="border-t border-charcoal/10 pt-4 mt-4">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-2">
                        Instructions
                      </p>
                      <p className="text-[12px] text-charcoal/70 leading-relaxed break-words">
                        {commission.instructions}
                      </p>
                    </div>

                    {commission.status === "COMPLETED" && (
                      <div className="mt-4 pt-4 border-t border-charcoal/10">
                        <Link
                          href="/shop"
                          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-terra hover:underline"
                        >
                          Shop Similar Artworks →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
