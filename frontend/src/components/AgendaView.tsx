"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { adminApi, type AdminAppointment } from "@/lib/adminApi";
import { formatDateBR, toISO, todayISO } from "@/lib/dates";
import { whatsappLink } from "@/lib/whatsapp";

const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });

const money = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function shift(iso: string, days: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return toISO(new Date(y, m - 1, d + days));
}

function formatPhone(p: string) {
  const d = p.replace(/\D/g, "");
  return d.length === 11 ? `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}` : p;
}

export function AgendaView() {
  const [date, setDate] = useState("");
  const [items, setItems] = useState<AdminAppointment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (d: string) => {
    setError(null);
    try {
      setItems(await adminApi.listAppointments(d));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao carregar a agenda.");
    }
  }, []);

  useEffect(() => {
    setDate(todayISO()); // só no navegador, evita diferença de fuso na hidratação
  }, []);

  useEffect(() => {
    if (!date) return;
    setItems(null);
    void load(date);
  }, [date, load]);

  async function cancel(a: AdminAppointment) {
    if (!window.confirm(`Cancelar o horário de ${a.clientName} às ${time(a.startTime)}?`)) return;
    setBusyId(a.id);
    try {
      await adminApi.cancelAppointment(a.id);
      await load(date);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível cancelar.");
    } finally {
      setBusyId(null);
    }
  }

  if (!date) return null;

  const [y, m, d] = date.split("-").map(Number);
  const weekday = WEEKDAYS[new Date(y, m - 1, d).getDay()];
  const active = items?.filter((i) => i.status !== "CANCELLED") ?? [];
  const total = active.reduce((sum, i) => sum + Number(i.price), 0);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2 rounded-2xl bg-white p-3 shadow-sm">
        <button
          type="button"
          aria-label="Dia anterior"
          onClick={() => setDate(shift(date, -1))}
          className="rounded-full p-2 text-petal-600 hover:bg-petal-100"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <p className="font-semibold">{formatDateBR(date)}</p>
          <p className="text-xs capitalize text-ink/60">{weekday}</p>
        </div>
        <button
          type="button"
          aria-label="Próximo dia"
          onClick={() => setDate(shift(date, 1))}
          className="rounded-full p-2 text-petal-600 hover:bg-petal-100"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setDate(todayISO())}
          className="rounded-full bg-petal-100 px-4 py-2 text-sm font-semibold text-petal-700 hover:bg-petal-200"
        >
          Hoje
        </button>
        <input
          type="date"
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
          className="rounded-full border-2 border-petal-200 bg-white px-4 py-1.5 text-sm outline-none focus:border-petal-500"
        />
        {items && (
          <p className="ml-auto text-sm text-ink/70">
            {active.length} {active.length === 1 ? "atendimento" : "atendimentos"} · {money(total)}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {!items && !error && <p className="text-sm text-ink/60">Carregando...</p>}
      {items && items.length === 0 && (
        <p className="rounded-2xl bg-white p-5 text-sm text-ink/60">Nenhum agendamento neste dia.</p>
      )}

      <ul className="grid gap-3 lg:grid-cols-2">
        {items?.map((a) => {
          const cancelled = a.status === "CANCELLED";
          const first = a.clientName.trim().split(" ")[0];
          const msg = `Olá, ${first}! Aqui é do estúdio, sobre seu horário de ${a.serviceName} em ${formatDateBR(date)} às ${time(a.startTime)}.`;
          return (
            <li
              key={a.id}
              className={`rounded-2xl bg-white p-4 shadow-sm ${cancelled ? "opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-lg font-bold text-petal-700">
                    {time(a.startTime)} <span className="text-sm font-normal text-ink/50">às {time(a.endTime)}</span>
                  </p>
                  <p className={`mt-1 truncate font-semibold ${cancelled ? "line-through" : ""}`}>
                    {a.clientName}
                  </p>
                  <p className="truncate text-sm text-ink/70">{a.serviceName}</p>
                  <p className="text-sm text-ink/50">{formatPhone(a.clientPhone)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-bold text-petal-700">{money(Number(a.price))}</p>
                  {cancelled && (
                    <span className="mt-1 inline-block rounded-full bg-petal-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-petal-700">
                      Cancelado
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <a
                  href={whatsappLink(a.clientPhone, msg)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-petal-100 py-2 text-sm font-semibold text-petal-700 hover:bg-petal-200"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                {!cancelled && (
                  <button
                    type="button"
                    disabled={busyId === a.id}
                    onClick={() => cancel(a)}
                    className="flex-1 rounded-full border-2 border-petal-200 py-2 text-sm font-semibold text-ink/70 hover:bg-petal-50 disabled:opacity-50"
                  >
                    {busyId === a.id ? "Cancelando..." : "Cancelar"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
