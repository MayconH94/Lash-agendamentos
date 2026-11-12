"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Clock, LayoutDashboard, Sparkles, type LucideIcon } from "lucide-react";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  soon?: boolean;
};

const items: Item[] = [
  { href: "/admin", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/admin/servicos", label: "Serviços", icon: Sparkles },
  { href: "/admin/horarios", label: "Horários", icon: Clock, soon: true },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays, soon: true },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:mt-8 lg:flex-col lg:overflow-visible">
      {items.map(({ href, label, icon: Icon, exact, soon }) => {
        const base =
          "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold lg:rounded-xl lg:py-3";

        if (soon) {
          return (
            <span key={href} className={`${base} cursor-not-allowed text-ink/30`}>
              <Icon size={16} />
              {label}
              <span className="text-[10px] font-normal">em breve</span>
            </span>
          );
        }

        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`${base} ${
              active
                ? "bg-petal-600 text-white"
                : "bg-petal-100 text-petal-700 hover:bg-petal-200 lg:bg-transparent lg:text-ink/70 lg:hover:bg-petal-100"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
