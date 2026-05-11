"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

interface LogoutButtonProps {
  className?: string;
}

export function LogoutButton({ className }: LogoutButtonProps) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={
        className ||
        "flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-linen/40 hover:text-linen transition-colors"
      }
    >
      <LogOut size={14} />
      Logout
    </button>
  );
}
