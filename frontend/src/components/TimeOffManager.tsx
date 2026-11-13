"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { adminApi, type TimeOff } from "@/lib/adminApi";
import { formatDateBR, todayISO } from "@/lib/dates";

// 05:00 até 23:30, de 30 em 30 minutos
const TIMES = Array.from({ length: 38 }, (_, i) => {
  const mins = 5 * 60 + i * 30;
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
});

const fieldClass =
  "rounded-xl border-2 border-petal-200 bg-petal-50 px-3 py-2 text-sm outline-none focus:border-petal-500";

const tz = "America/Sao_Paulo";
const dateOf = (iso: string) => new Date(iso).toLocaleDateString("sv-SE", { timeZone: tz }); // yyyy-mm-dd
const timeOf = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: tz });

function describe(t: TimeOff) {
  const day = formatDateBR(dateOf(t.startTime));
  const start = timeOf(t.startTime);
  const end = timeOf(t.endTime);
  const wholeDay = start === "00:00" && end === "00:00";
  return { day, range: wholeDay ? "Dia inteiro" : `${start} às ${end}` };
}

export function TimeOffManager({ initial }: { initial: TimeOff[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [date, setDate] = useState("");
  const [allDay, setAllDay] = useState(true);
  const [start, setStart] = useState("12:00");
  const [end, setEnd] = useState("14:00");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setError("Escolha a data.");
      return;
    }
    if (!allDay && end <= start) {
      setError("O fim precisa ser depois do início.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const created = await adminApi.createTimeOff({
        date,
        allDay,
        start: allDay ? null : start,
        end: allDay ? null : end,
        reason: reason.trim() || null,
      });
      setItems((prev) => [...prev, created].sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setReason("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(t: TimeOff) {
    const { day, range } = describe(t);
    if (!window.confirm(`Remover a folga de ${day} (${range})? Esse horário volta a ficar disponível.`)) return;
    try {
      await adminApi.deleteTimeOff(t.id);
      setItems((prev) => prev.filter((i) => i.id !== t.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover.");
    }
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <form onSubmit={add} className="h-fit space-y-4 rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold">Nova folga</h2>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Data</span>
          <input
            type="date"
            value={date}
            min={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            className={`${fieldClass} w-full`}
          />
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="h-4 w-4 accent-petal-600"
          />
          Dia inteiro
        </label>

        {!allDay && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink/60">Das</span>
            <select aria-label="Início" value={start} onChange={(e) => setStart(e.target.value)} className={fieldClass}>
              {TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
            <span className="text-ink/60">às</span>
            <select aria-label="Fim" value={end} onChange={(e) => setEnd(e.target.value)} className={fieldClass}>
              {TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Motivo (opcional)</span>
          <input
            type="text"
            value={reason}
            maxLength={100}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex.: Feriado, consulta, viagem"
            className={`${fieldClass} w-full`}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-full bg-petal-600 py-3 font-semibold text-white shadow-lg shadow-petal-600/30 hover:bg-petal-700 disabled:bg-petal-300"
        >
          {saving ? "Salvando..." : "Bloquear horário"}
        </button>
        <p className="text-xs text-ink/50">
          Atenção: agendamentos que já existem nesse período não são cancelados. Veja na Agenda e avise a cliente.
        </p>
      </form>

      <div>
        <h2 className="mb-3 font-semibold">Próximas folgas</h2>
        {items.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-ink/60">Nenhuma folga marcada.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((t) => {
              const { day, range } = describe(t);
              return (
                <li key={t.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <div className="min-w-0">
                    <p className="font-semibold">{day}</p>
                    <p className="text-sm text-ink/70">{range}</p>
                    {t.reason && <p className="truncate text-sm text-ink/50">{t.reason}</p>}
                  </div>
                  <button
                    type="button"
                    aria-label="Remover folga"
                    onClick={() => remove(t)}
                    className="rounded-full p-2 text-petal-600 hover:bg-petal-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
