"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { CalendarDays, Clock, LayoutDashboard, Settings } from "lucide-react";
import { ServiceIcon } from "@/components/ServiceIcon";

type Item = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  exact?: boolean;
  soon?: boolean;
};

const items: Item[] = [
  { href: "/admin", label: "Início", icon: LayoutDashboard, exact: true },
  { href: "/admin/servicos", label: "Serviços", icon: ServiceIcon },
  { href: "/admin/horarios", label: "Horários", icon: Clock, soon: true },
  { href: "/admin/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-3 flex flex-wrap gap-2 lg:mt-8 lg:flex-col">
      {items.map(({ href, label, icon: Icon, exact, soon }) => {
        const base =
          "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm min-[400px]:gap-2 min-[400px]:px-4 font-semibold lg:rounded-xl lg:py-3";

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
