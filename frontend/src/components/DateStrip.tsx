"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toISO, todayISO } from "@/lib/dates";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MAX_WEEKS = 8;

const noSubscription = () => () => {};

type Props = {
  value: string;
  onChange: (isoDate: string) => void;
};

export default function DateStrip({ value, onChange }: Props) {
  const [week, setWeek] = useState(0);

  // No servidor devolve "" (sem data); no navegador devolve o dia de hoje
  const todayIso = useSyncExternalStore(noSubscription, todayISO, () => "");

  if (!todayIso) {
    return <div className="h-32 rounded-3xl bg-white/70 shadow-lg" />;
  }

  const [y, m, d] = todayIso.split("-").map(Number);
  const today = new Date(y, m - 1, d);

  const days = Array.from(
    { length: 7 },
    (_, i) =>
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + week * 7 + i)
  );
  const first = days[0];
  const last = days[6];
  const monthLabel =
    first.getMonth() === last.getMonth()
      ? MONTHS[first.getMonth()]
      : `${MONTHS[first.getMonth()]} / ${MONTHS[last.getMonth()]}`;

  return (
    <section className="rounded-3xl bg-white p-4 shadow-lg shadow-petal-300/40">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Semana anterior"
          disabled={week === 0}
          onClick={() => setWeek(week - 1)}
          className="rounded-full p-1.5 text-petal-600 transition hover:bg-petal-100 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="font-semibold">{monthLabel}</h2>
        <button
          type="button"
          aria-label="Próxima semana"
          disabled={week >= MAX_WEEKS - 1}
          onClick={() => setWeek(week + 1)}
          className="rounded-full p-1.5 text-petal-600 transition hover:bg-petal-100 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const iso = toISO(d);
          const selected = iso === value;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onChange(iso)}
              className={`flex flex-col items-center rounded-2xl py-2 text-xs transition ${
                selected
                  ? "bg-petal-600 text-white shadow-md"
                  : "bg-petal-100 hover:bg-petal-200"
              }`}
            >
              <span className="opacity-80">{WEEKDAYS[d.getDay()]}</span>
              <span className="mt-0.5 text-base font-bold">{d.getDate()}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
