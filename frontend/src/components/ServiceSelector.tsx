"use client";

import { useState } from "react";
import { Check, Clock } from "lucide-react";
import { ServiceIcon } from "@/components/ServiceIcon";
import type { Service } from "@/lib/api";
import { formatDuration } from "@/lib/duration";

type Props = {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
};

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const categoryOf = (s: Service) => s.categoryName ?? "Outros";

export default function ServiceSelector({ services, selectedId, onSelect }: Props) {
  const [filter, setFilter] = useState("all");

  const categories = Array.from(new Set(services.map(categoryOf)));
  const active = filter === "all" || categories.includes(filter) ? filter : "all";
  const visible = active === "all" ? services : services.filter((s) => categoryOf(s) === active);
  const showTabs = categories.length > 1;

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Serviços</h2>

      {showTabs && (
        <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {["all", ...categories].map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setFilter(c)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-petal-600 text-white shadow-sm"
                    : "bg-petal-100 text-petal-700 hover:bg-petal-200"
                }`}
              >
                {c === "all" ? "Todos" : c}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="rounded-2xl bg-white p-4 text-sm text-ink/60">
            Nenhum serviço disponível no momento.
          </p>
        )}

        {visible.map((s) => {
          const selected = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className={`flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left transition ${
                selected ? "shadow-md ring-2 ring-petal-500" : "shadow-sm hover:shadow-md"
              }`}
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-petal-200 to-petal-300 text-petal-700">
                {s.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
                ) : (
                  <ServiceIcon size={36} />
                )}
              </span>

              <span className="min-w-0 flex-1">
                {showTabs && active === "all" && (
                  <span className="mb-1 inline-block rounded-full bg-petal-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-petal-700">
                    {categoryOf(s)}
                  </span>
                )}
                <span className="block font-semibold">{s.name}</span>
                {s.description && (
                  <span className="mt-0.5 line-clamp-2 block text-xs text-ink/60">{s.description}</span>
                )}
                <span className="mt-1 flex items-center gap-1 text-xs text-ink/60">
                  <Clock size={12} /> {formatDuration(s.durationMinutes)}
                </span>
              </span>

              <span className="flex flex-col items-end gap-1">
                <span className="font-bold text-petal-600">{money(s.price)}</span>
                {selected && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-petal-600 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
