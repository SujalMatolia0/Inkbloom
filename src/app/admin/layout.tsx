import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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
    <div className="min-h-screen bg-deep relative" data-lenis-prevent>
      <AdminSidebar user={{ name: user.name, email: user.email }} />

      {/* Main Content Area: responsive ml-0 on mobile with top padding, ml-[280px] on desktop */}
      <main className="ml-0 lg:ml-[280px] pt-14 lg:pt-0 min-h-screen bg-deep relative">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-terra/5 blur-[120px] pointer-events-none rounded-full -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
