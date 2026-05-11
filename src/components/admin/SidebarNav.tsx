"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  FileText, 
  Users, 
  BarChart3, 
  Image as ImageIcon,
  MessageSquare
} from "lucide-react";
import { cn } from "@/theme/components";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Products", href: "/admin/products", icon: ImageIcon },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Journal", href: "/admin/posts", icon: FileText },
  { label: "Commissions", href: "/admin/commissions", icon: MessageSquare },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex-1 space-y-1.5 mt-8">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200 group",
              isActive 
                ? "bg-terra text-linen shadow-neo-ch" 
                : "text-linen/50 hover:text-linen hover:bg-linen/5"
            )}
          >
            <item.icon 
              size={16} 
              className={cn(
                "transition-colors",
                isActive ? "text-linen" : "text-terra opacity-60 group-hover:opacity-100"
              )} 
            />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
