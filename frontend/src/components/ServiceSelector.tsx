"use client";

import { Check, Clock, Sparkles } from "lucide-react";
import type { Service } from "@/lib/api";
import { formatDuration } from "@/lib/duration";

type Props = {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
};

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function ServiceSelector({ services, selectedId, onSelect }: Props) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Serviços</h2>

      <div className="space-y-3">
        {services.map((s) => {
          const selected = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s)}
              className={`flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left transition ${
                selected
                  ? "shadow-md ring-2 ring-petal-500"
                  : "shadow-sm hover:shadow-md"
              }`}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-petal-200 to-petal-300 text-petal-700">
                <Sparkles size={24} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{s.name}</span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-ink/60">
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