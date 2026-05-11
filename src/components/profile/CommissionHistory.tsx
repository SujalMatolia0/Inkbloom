import { FileText, CheckCircle2, XCircle, Clock } from "lucide-react";

interface Commission {
  id: string;
  status: string;
  price?: number;
  createdAt: Date;
}

const statusConfig: Record<string, { color: string; icon: any }> = {
  PENDING: { color: "text-blush", icon: Clock },
  REVIEWING: { color: "text-terra", icon: FileText },
  ACCEPTED: { color: "text-moss", icon: CheckCircle2 },
  REJECTED: { color: "text-charcoal/40", icon: XCircle },
  IN_PROGRESS: { color: "text-terra", icon: FileText },
  COMPLETED: { color: "text-moss", icon: CheckCircle2 },
};

export function CommissionHistory({ commissions }: { commissions: Commission[] }) {
  if (commissions.length === 0) {
    return (
      <div className="bg-linen border border-charcoal p-8 text-center">
        <FileText size={32} className="text-charcoal/20 mx-auto mb-3" />
        <p className="text-[13px] text-charcoal/40">
          No commissions yet
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {commissions.map((commission) => {
        const StatusIcon = statusConfig[commission.status]?.icon || FileText;
        return (
          <div
            key={commission.id}
            className="flex items-center justify-between p-4 bg-linen border border-charcoal"
          >
            <div>
              <p className="text-[12px] font-semibold text-charcoal">
                Commission #{commission.id.slice(-8)}
              </p>
              <p className="text-[10px] text-charcoal/40 mt-1">
                {new Date(commission.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              {commission.price && (
                <p className="text-[13px] font-bold text-terra">
                  ₹{commission.price.toFixed(2)}
                </p>
              )}
              <span
                className={`text-[10px] font-semibold uppercase tracking-[0.1em] flex items-center gap-1 justify-end ${
                  statusConfig[commission.status]?.color || "text-charcoal/40"
                }`}
              >
                <StatusIcon size={12} />
                {commission.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
