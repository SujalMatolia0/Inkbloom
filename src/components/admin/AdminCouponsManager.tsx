"use client";

import { useState } from "react";
import { 
  Tag, 
  Sparkles, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Calendar, 
  Percent, 
  IndianRupee, 
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  festivalName: string | null;
  isActive: boolean;
  validUntil: string | Date | null;
  usedCount: number;
  createdAt: string | Date;
}

interface AdminCouponsManagerProps {
  initialCoupons: Coupon[];
}

export function AdminCouponsManager({ initialCoupons }: AdminCouponsManagerProps) {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New coupon form state
  const [formData, setFormData] = useState({
    code: "",
    festivalName: "",
    description: "",
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    validUntil: "",
  });

  // Filter coupons
  const filteredCoupons = coupons.filter((coupon) => {
    const matchesSearch = 
      coupon.code.toLowerCase().includes(search.toLowerCase()) ||
      (coupon.festivalName && coupon.festivalName.toLowerCase().includes(search.toLowerCase())) ||
      coupon.description.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "ACTIVE") return coupon.isActive;
    if (filter === "INACTIVE") return !coupon.isActive;
    return true;
  });

  // Toggle active status
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic update
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
      );

      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: currentStatus } : c))
        );
        alert("Failed to update coupon status.");
      }
    } catch (err) {
      console.error(err);
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: currentStatus } : c))
      );
    }
  };

  // Delete coupon
  const handleDeleteCoupon = async (id: string, code: string) => {
    if (!confirm(`Are you sure you want to delete coupon code "${code}"?`)) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete coupon.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting coupon.");
    }
  };

  // Handle form submission
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.code.trim()) {
      setErrorMessage("Coupon code is required.");
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage("Description is required.");
      return;
    }
    const val = parseFloat(formData.discountValue);
    if (isNaN(val) || val <= 0) {
      setErrorMessage("Please enter a valid discount value greater than 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code.trim().toUpperCase(),
          festivalName: formData.festivalName.trim() || null,
          description: formData.description.trim(),
          discountType: formData.discountType,
          discountValue: val,
          minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : null,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create coupon.");
      } else {
        setCoupons((prev) => [data.coupon, ...prev]);
        setIsModalOpen(false);
        setFormData({
          code: "",
          festivalName: "",
          description: "",
          discountType: "PERCENTAGE",
          discountValue: "",
          minOrderAmount: "",
          maxDiscount: "",
          validUntil: "",
        });
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error creating coupon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCount = coupons.filter((c) => c.isActive).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c.usedCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-linen/[0.04] border border-linen/15">
          <div className="flex items-center justify-between text-linen/40 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Coupons</span>
            <Tag size={15} className="text-terra" />
          </div>
          <div className="font-serif text-3xl font-bold text-linen">{coupons.length}</div>
          <p className="text-[10px] text-linen/40 mt-1">Configured studio promotional codes</p>
        </div>

        <div className="p-5 bg-linen/[0.04] border border-linen/15">
          <div className="flex items-center justify-between text-linen/40 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Active Festivals</span>
            <Sparkles size={15} className="text-terra-pale" />
          </div>
          <div className="font-serif text-3xl font-bold text-terra-pale">{activeCount}</div>
          <p className="text-[10px] text-linen/40 mt-1">Currently redeemable in store</p>
        </div>

        <div className="p-5 bg-linen/[0.04] border border-linen/15">
          <div className="flex items-center justify-between text-linen/40 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Redemptions</span>
            <Percent size={15} className="text-linen/60" />
          </div>
          <div className="font-serif text-3xl font-bold text-linen">{totalRedemptions}</div>
          <p className="text-[10px] text-linen/40 mt-1">Orders placed using festival discounts</p>
        </div>

        <div className="p-5 bg-linen/[0.04] border border-linen/15">
          <div className="flex items-center justify-between text-linen/40 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Quick Action</span>
            <Tag size={15} className="text-terra" />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full mt-1 inline-flex items-center justify-center gap-1.5 bg-terra hover:bg-terra-dark text-linen text-[10.5px] font-bold uppercase tracking-wider py-2 px-3 border border-terra transition-all shadow-[2px_2px_0_rgba(0,0,0,0.5)] cursor-pointer"
          >
            <Plus size={13} />
            <span>Create Festival Coupon</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search, Filters, New Coupon Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-linen/[0.03] border border-linen/15">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-linen/40" />
          <input
            type="text"
            placeholder="Search coupon code, festival or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra placeholder:text-linen/30 font-sans"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
              filter === "ALL"
                ? "bg-terra text-linen border-terra"
                : "bg-transparent text-linen/60 border-linen/20 hover:text-linen hover:border-linen/40"
            }`}
          >
            All ({coupons.length})
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
              filter === "ACTIVE"
                ? "bg-terra text-linen border-terra"
                : "bg-transparent text-linen/60 border-linen/20 hover:text-linen hover:border-linen/40"
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setFilter("INACTIVE")}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border transition-colors ${
              filter === "INACTIVE"
                ? "bg-terra text-linen border-terra"
                : "bg-transparent text-linen/60 border-linen/20 hover:text-linen hover:border-linen/40"
            }`}
          >
            Inactive ({coupons.length - activeCount})
          </button>
        </div>
      </div>

      {/* Coupons Table */}
      <div className="border border-linen/15 bg-[#140E0A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-linen/15 bg-linen/[0.04] text-[9.5px] font-bold uppercase tracking-[0.2em] text-linen/50">
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Festival / Event</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Conditions</th>
                <th className="p-4 text-center">Times Used</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-linen/10">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-linen/40">
                    No promotional coupons match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-linen/[0.02] transition-colors">
                    {/* Code */}
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-terra/20 border border-terra/50 text-[#F5EFE6] font-mono font-bold text-xs tracking-wider">
                        <Tag size={11} className="text-terra-pale" />
                        <span>{coupon.code}</span>
                      </div>
                    </td>

                    {/* Festival */}
                    <td className="p-4">
                      <div className="font-medium text-linen text-[12.5px]">
                        {coupon.festivalName || "Studio Special"}
                      </div>
                      <div className="text-[11px] text-linen/50 font-sans mt-0.5 max-w-xs">
                        {coupon.description}
                      </div>
                    </td>

                    {/* Discount */}
                    <td className="p-4">
                      <div className="font-serif font-bold text-terra-pale text-sm">
                        {coupon.discountType === "PERCENTAGE"
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue.toLocaleString("en-IN")} FLAT OFF`}
                      </div>
                      {coupon.maxDiscount && (
                        <div className="text-[10px] text-linen/40 mt-0.5">
                          Cap: ₹{coupon.maxDiscount.toLocaleString("en-IN")}
                        </div>
                      )}
                    </td>

                    {/* Conditions */}
                    <td className="p-4 text-[11px] text-linen/60 font-sans">
                      <div>
                        Min Order: {coupon.minOrderAmount ? `₹${coupon.minOrderAmount.toLocaleString("en-IN")}` : "No minimum"}
                      </div>
                      {coupon.validUntil ? (
                        <div className="text-[10px] text-linen/40 flex items-center gap-1 mt-0.5">
                          <Calendar size={10} />
                          <span>Until {new Date(coupon.validUntil).toLocaleDateString("en-IN")}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-linen/40 mt-0.5">Permanent offer</div>
                      )}
                    </td>

                    {/* Times Used */}
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-linen/10 border border-linen/15 font-mono text-[11px] font-bold text-linen">
                        {coupon.usedCount || 0}
                      </span>
                    </td>

                    {/* Active Toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(coupon.id, coupon.isActive)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                          coupon.isActive
                            ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60"
                            : "bg-red-950/40 border-red-500/40 text-red-300 hover:bg-red-900/40"
                        }`}
                        title={coupon.isActive ? "Click to deactivate" : "Click to activate"}
                      >
                        {coupon.isActive ? (
                          <>
                            <CheckCircle2 size={11} className="text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={11} className="text-red-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                        className="p-1.5 text-linen/40 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#1C1410] border border-terra/60 w-full max-w-lg shadow-[8px_8px_0_rgba(0,0,0,0.8)] my-8">
            <div className="flex items-center justify-between p-5 border-b border-linen/15 bg-[#140E0A]">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-terra" />
                <h3 className="font-serif text-lg font-bold text-linen">Create Festival Coupon</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-linen/50 hover:text-linen p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Code */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                    Coupon Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.G. DIWALI20"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs font-mono uppercase focus:outline-none focus:border-terra"
                  />
                </div>

                {/* Festival Name */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                    Festival / Event Name
                  </label>
                  <input
                    type="text"
                    placeholder="E.G. Diwali Utsav"
                    value={formData.festivalName}
                    onChange={(e) => setFormData({ ...formData, festivalName: e.target.value })}
                    className="w-full px-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.G. 20% off all illuminated bottle art & keepsakes"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as "PERCENTAGE" | "FIXED" })
                    }
                    className="w-full px-3 py-2 bg-[#251810] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹ INR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                    Discount Value * ({formData.discountType === "PERCENTAGE" ? "%" : "₹"})
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder={formData.discountType === "PERCENTAGE" ? "20" : "500"}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                    Min Order Amount (₹ INR, Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="E.G. 1500"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                    Max Discount Cap (₹ INR, Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="E.G. 2000"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra"
                  />
                </div>
              </div>

              {/* Expiration Date */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-linen/70 mb-1">
                  Valid Until (Optional)
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3 py-2 bg-linen/[0.05] border border-linen/20 text-linen text-xs focus:outline-none focus:border-terra"
                />
              </div>

              {/* Submit / Cancel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-linen/15">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-linen/20 text-linen/60 hover:text-linen text-xs uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 bg-terra hover:bg-terra-dark text-linen text-xs font-bold uppercase tracking-wider py-2 px-5 border border-terra transition-all shadow-[2px_2px_0_rgba(0,0,0,0.5)] disabled:opacity-50 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>{isSubmitting ? "Creating..." : "Save Coupon"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
