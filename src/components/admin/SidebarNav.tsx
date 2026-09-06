"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  FileText, 
  Users, 
  BarChart3, 
  Palette,
  MessageSquare,
  ExternalLink,
  Eye,
  Tag,
  Sparkles,
  HelpCircle,
  Star
} from "lucide-react";
import { cn } from "@/theme/components";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Artworks", href: "/admin/products", icon: Palette },
  { label: "3D Gallery", href: "/admin/gallery", icon: Sparkles },
  { label: "Coupons & Sales", href: "/admin/coupons", icon: Tag },
  { label: "Commissions", href: "/admin/commissions", icon: MessageSquare },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Journal", href: "/admin/posts", icon: FileText },
  { label: "Customers", href: "/admin/customers", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex-1 space-y-6 mt-6">
      <div className="space-y-1">
        <div className="px-4 pb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-linen/30">
          Studio Management
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200 group border-l-2",
                isActive 
                  ? "bg-terra/15 text-terra-pale border-terra shadow-sm" 
                  : "border-transparent text-linen/60 hover:text-linen hover:bg-linen/5"
              )}
            >
              <item.icon 
                size={15} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-terra-pale" : "text-terra/60 group-hover:text-terra"
                )} 
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Storefront Shortcuts */}
      <div className="pt-4 border-t border-linen/10 space-y-1">
        <div className="px-4 pb-2 text-[9px] font-bold uppercase tracking-[0.25em] text-linen/30">
          Live Storefront
        </div>
        <Link
          href="/shop"
          target="_blank"
          className="flex items-center justify-between px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-linen/50 hover:text-terra hover:bg-linen/5 transition-all group"
        >
          <span className="flex items-center gap-2.5">
            <Eye size={14} className="text-terra/60 group-hover:text-terra" />
            <span>Visit Shop</span>
          </span>
          <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
        </Link>
        <Link
          href="/portfolio"
          target="_blank"
          className="flex items-center justify-between px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.12em] text-linen/50 hover:text-terra hover:bg-linen/5 transition-all group"
        >
          <span className="flex items-center gap-2.5">
            <Palette size={14} className="text-terra/60 group-hover:text-terra" />
            <span>3D Gallery</span>
          </span>
          <ExternalLink size={12} className="opacity-40 group-hover:opacity-100" />
        </Link>
      </div>
    </div>
  );
}
