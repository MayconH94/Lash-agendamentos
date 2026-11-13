"use client";

import { useState } from "react";
import { adminApi, type WorkingDay } from "@/lib/adminApi";

const DAYS = ["", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

// 05:00 até 23:30, de 30 em 30 minutos
const TIMES = Array.from({ length: 38 }, (_, i) => {
  const mins = 5 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

type DayState = {
  dayOfWeek: number;
  open: boolean;
  start: string;
  end: string;
  lunch: boolean;
  lunchStart: string;
  lunchEnd: string;
};

function fromApi(day: WorkingDay): DayState {
  const iv = day.intervals;
  if (iv.length === 0) {
    return { dayOfWeek: day.dayOfWeek, open: false, start: "09:00", end: "18:00", lunch: false, lunchStart: "12:00", lunchEnd: "13:00" };
  }
  const first = iv[0];
  const last = iv[iv.length - 1];
  const hasGap = iv.length > 1;
  return {
    dayOfWeek: day.dayOfWeek,
    open: true,
    start: first.start,
    end: last.end,
    lunch: hasGap,
    lunchStart: hasGap ? first.end : "12:00",
    lunchEnd: hasGap ? iv[1].start : "13:00",
  };
}

function toApi(d: DayState): WorkingDay {
  if (!d.open) return { dayOfWeek: d.dayOfWeek, intervals: [] };
  if (!d.lunch) return { dayOfWeek: d.dayOfWeek, intervals: [{ start: d.start, end: d.end }] };
  return {
    dayOfWeek: d.dayOfWeek,
    intervals: [
      { start: d.start, end: d.lunchStart },
      { start: d.lunchEnd, end: d.end },
    ],
  };
}

function validate(d: DayState): string | null {
  if (!d.open) return null;
  if (d.end <= d.start) return "O fechamento precisa ser depois da abertura.";
  if (d.lunch) {
    if (d.lunchEnd <= d.lunchStart) return "O fim do intervalo precisa ser depois do início.";
    if (d.lunchStart <= d.start || d.lunchEnd >= d.end) return "O intervalo precisa ficar dentro do expediente.";
  }
  return null;
}

const selectClass =
  "rounded-xl border-2 border-petal-200 bg-petal-50 px-3 py-2 text-sm outline-none focus:border-petal-500";

function TimeSelect({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={selectClass}>
      {TIMES.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
  );
}

export function HoursForm({ initial }: { initial: WorkingDay[] }) {
  const [days, setDays] = useState<DayState[]>(() => initial.map(fromApi));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  function update(index: number, patch: Partial<DayState>) {
    setMessage(null);
    setDays((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  async function save() {
    for (const d of days) {
      const err = validate(d);
      if (err) {
        setMessage({ ok: false, text: `${DAYS[d.dayOfWeek]}: ${err}` });
        return;
      }
    }
    setSaving(true);
    setMessage(null);
    try {
      await adminApi.saveWorkingHours(days.map(toApi));
      setMessage({ ok: true, text: "Horários salvos!" });
    } catch (e) {
      setMessage({ ok: false, text: e instanceof Error ? e.message : "Não foi possível salvar." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 space-y-3">
      <ul className="grid gap-3 lg:grid-cols-2">
        {days.map((d, i) => (
          <li key={d.dayOfWeek} className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className={`font-semibold ${d.open ? "" : "text-ink/40"}`}>{DAYS[d.dayOfWeek]}</p>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <span className="text-ink/60">{d.open ? "Aberto" : "Fechado"}</span>
                <input
                  type="checkbox"
                  checked={d.open}
                  onChange={(e) => update(i, { open: e.target.checked })}
                  className="h-5 w-5 accent-petal-600"
                />
              </label>
            </div>

            {d.open && (
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="text-ink/60">Das</span>
                  <TimeSelect label="Abertura" value={d.start} onChange={(v) => update(i, { start: v })} />
                  <span className="text-ink/60">às</span>
                  <TimeSelect label="Fechamento" value={d.end} onChange={(v) => update(i, { end: v })} />
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={d.lunch}
                    onChange={(e) => update(i, { lunch: e.target.checked })}
                    className="h-4 w-4 accent-petal-600"
                  />
                  Intervalo (almoço)
                </label>

                {d.lunch && (
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-ink/60">Das</span>
                    <TimeSelect label="Início do intervalo" value={d.lunchStart} onChange={(v) => update(i, { lunchStart: v })} />
                    <span className="text-ink/60">às</span>
                    <TimeSelect label="Fim do intervalo" value={d.lunchEnd} onChange={(v) => update(i, { lunchEnd: v })} />
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      {message && (
        <p className={`text-sm ${message.ok ? "text-green-700" : "text-red-600"}`}>{message.text}</p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full rounded-full bg-petal-600 py-4 font-semibold text-white shadow-lg shadow-petal-600/30 transition hover:bg-petal-700 disabled:bg-petal-300 sm:w-auto sm:px-10"
      >
        {saving ? "Salvando..." : "Salvar horários"}
      </button>
    </div>
  );
}
