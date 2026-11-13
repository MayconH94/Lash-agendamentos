"use client";

import type { Slot } from "@/lib/api";

type Props = {
  ready: boolean; // já escolheu dia E serviço?
  slots: Slot[];
  selectedStart: string | null;
  loading: boolean;
  error: string | null;
  onSelect: (slot: Slot) => void;
};

export default function TimeSlotGrid({
  ready,
  slots,
  selectedStart,
  loading,
  error,
  onSelect,
}: Props) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">Horários Disponíveis</h2>

      {!ready && (
        <p className="rounded-2xl bg-white/70 p-4 text-sm text-ink/60">
          Escolha o dia e o serviço para ver os horários.
        </p>
      )}
      {ready && loading && <p className="text-sm text-ink/60">Buscando horários...</p>}
      {ready && error && <p className="text-sm text-red-600">{error}</p>}
      {ready && !loading && !error && slots.length === 0 && (
        <p className="rounded-2xl bg-white/70 p-4 text-sm text-ink/60">
          Nenhum horário disponível neste dia. Tente outra data.
        </p>
      )}

      {ready && (
        <div className="grid grid-cols-3 gap-2 min-[360px]:grid-cols-4">
          {slots.map((slot) => {
            const selected = slot.startTime === selectedStart;
            return (
              <button
                key={slot.startTime}
                type="button"
                onClick={() => onSelect(slot)}
                className={`rounded-full py-2.5 text-sm font-semibold transition ${
                  selected
                    ? "scale-105 bg-petal-600 text-white shadow-md"
                    : "bg-petal-200 text-petal-700 hover:bg-petal-300"
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}