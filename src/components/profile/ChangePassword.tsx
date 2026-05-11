"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { changePassword } from "./actions";

export function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);

      const res = await fetch("/api/profile/change-password", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to change password");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-linen border border-charcoal p-6 space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-[12px] text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-terra/10 border border-terra/20 text-[12px] text-terra flex items-center gap-2">
          <CheckCircle2 size={14} />
          Password changed successfully!
        </div>
      )}

      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/60 mb-2">
          Current Password
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className="w-full h-[44px] px-4 border border-charcoal bg-transparent text-[13px] focus:outline-none focus:border-terra"
        />
      </div>

      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/60 mb-2">
          New Password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={6}
          className="w-full h-[44px] px-4 border border-charcoal bg-transparent text-[13px] focus:outline-none focus:border-terra"
        />
      </div>

      <div>
        <label className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/60 mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full h-[44px] px-4 border border-charcoal bg-transparent text-[13px] focus:outline-none focus:border-terra"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-[44px] px-6 bg-charcoal text-linen text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-charcoal/90 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            Updating...
          </span>
        ) : (
          "Change Password"
        )}
      </button>
    </form>
  );
}
