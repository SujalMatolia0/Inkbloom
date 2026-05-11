import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ShoppingBag, Package, FileText, Users, BarChart3, Image as ImageIcon } from "lucide-react";
import { LogoutButton } from "@/components/ui/LogoutButton";

import { SidebarNav } from "@/components/admin/SidebarNav";

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-deep flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[280px] bg-deep2 border-r border-charcoal/30 flex flex-col h-screen overflow-hidden">
        {/* Logo Section */}
        <div className="p-8 pb-10">
          <Link href="/" className="group block">
            <h1 className="font-serif text-[26px] font-bold text-linen leading-none tracking-tight">
              Inkb<span className="text-terra italic group-hover:text-terra-pale transition-colors">loom</span>
            </h1>
            <div className="flex items-center gap-2 mt-3">
              <div className="w-10 h-[1.5px] bg-terra/40"></div>
              <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-terra">
                Studio Admin
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation - SidebarNav handles the logic */}
        <div className="px-4 flex-1 overflow-y-auto scrollbar-hide">
          <SidebarNav />
        </div>

        {/* User Profile & Logout - Bottom of Sidebar */}
        <div className="p-6 mt-auto border-t border-linen/5 bg-black/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-terra flex items-center justify-center text-[12px] font-bold text-linen">
              {user.name?.[0] || "A"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-linen truncate">{user.name || "Admin"}</p>
              <p className="text-[9px] text-linen/30 truncate">{user.email}</p>
            </div>
          </div>
          <LogoutButton className="w-full h-10 border border-linen/10 text-[10px] font-bold uppercase tracking-[0.15em] text-linen/60 hover:bg-linen/5 hover:text-linen transition-all flex items-center justify-center gap-2" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-deep relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-terra/5 blur-[120px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
