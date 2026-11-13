"use client";

import { useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";
import type { ReturnItem } from "@/lib/adminApi";
import { formatDateBR } from "@/lib/dates";
import { whatsappLink } from "@/lib/whatsapp";

const noSubscription = () => () => {};
const tz = "America/Sao_Paulo";
const dayOf = (iso: string) => new Date(iso).toLocaleDateString("sv-SE", { timeZone: tz });

function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : p;
}

function badge(days: number) {
  if (days > 0) return { text: `Atrasada há ${days} ${days === 1 ? "dia" : "dias"}`, cls: "bg-petal-600 text-white" };
  if (days === 0) return { text: "Vence hoje", cls: "bg-petal-500 text-white" };
  const left = -days;
  return { text: `Vence em ${left} ${left === 1 ? "dia" : "dias"}`, cls: "bg-petal-100 text-petal-700" };
}

export function ReturnsList({ items }: { items: ReturnItem[] }) {
  // No servidor devolve ""; no navegador devolve o endereço do site
  const siteLink = useSyncExternalStore(noSubscription, () => window.location.origin, () => "");

  if (items.length === 0) {
    return (
      <p className="mt-6 rounded-2xl bg-white p-5 text-sm text-ink/60">
        Ninguém na hora da manutenção por enquanto. 💕
      </p>
    );
  }

  return (
    <ul className="mt-6 grid gap-3 lg:grid-cols-2">
      {items.map((r) => {
        const first = r.clientName.trim().split(" ")[0];
        const b = badge(r.daysOverdue);
        const msg =
          `Oi, ${first}! Já está na hora da manutenção (${r.serviceName}) 💕 ` +
          `Quer agendar o seu horário?` +
          (siteLink ? ` É rapidinho por aqui: ${siteLink}` : "");

        return (
          <li key={`${r.clientPhone}-${r.serviceId}`} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">{r.clientName}</p>
                <p className="truncate text-sm text-ink/70">{r.serviceName}</p>
                <p className="text-sm text-ink/50">{formatPhone(r.clientPhone)}</p>
                <p className="mt-1 text-xs text-ink/50">
                  Último atendimento: {formatDateBR(dayOf(r.lastVisit))} · prazo {formatDateBR(r.dueDate)}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${b.cls}`}>{b.text}</span>
            </div>

            <a
              href={whatsappLink(r.clientPhone, msg)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-full bg-petal-600 py-2.5 text-sm font-semibold text-white hover:bg-petal-700"
            >
              <MessageCircle size={16} /> Chamar no WhatsApp
            </a>
          </li>
        );
      })}
    </ul>
  );
}
