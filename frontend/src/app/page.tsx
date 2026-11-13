"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import DateStrip from "@/components/DateStrip";
import ServiceSelector from "@/components/ServiceSelector";
import TimeSlotGrid from "@/components/TimeSlotGrid";
import BookingForm from "@/components/BookingForm";
import {
  getPublicSettings,
  getServices,
  getSlots,
  type Appointment,
  type Service,
  type Slot,
} from "@/lib/api";
import { formatDateBR } from "@/lib/dates";
import { whatsappLink } from "@/lib/whatsapp";

type SlotsState = { key: string; slots: Slot[]; error: string | null };

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [slotsState, setSlotsState] = useState<SlotsState | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [confirmed, setConfirmed] = useState<Appointment | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  // WhatsApp da profissional (cadastrado no painel). Sem número, os links não aparecem.
  const [whatsapp, setWhatsapp] = useState<string | null>(null);

  useEffect(() => {
    getPublicSettings()
      .then((s) => setWhatsapp(s.whatsapp))
      .catch(() => {
        // sem o número, a página funciona normalmente, só sem o link
      });
  }, []);

  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((e) => setError(e.message));
  }, []);

  // Identifica "qual pedido de horários" está valendo agora
  const slotsKey = selected && date ? `${selected.id}|${date}|${refreshKey}` : null;

  useEffect(() => {
    if (!slotsKey || !selected) return;

    let cancelled = false; // ignora respostas de pedidos antigos

    getSlots(date, selected.id)
      .then((data) => {
        if (!cancelled) setSlotsState({ key: slotsKey, slots: data, error: null });
      })
      .catch((e) => {
        if (!cancelled) setSlotsState({ key: slotsKey, slots: [], error: e.message });
      });

    return () => {
      cancelled = true;
    };
  }, [slotsKey, selected, date]);

  // Só vale se a resposta guardada é do pedido atual; senão ainda está carregando
  const current = slotsState?.key === slotsKey ? slotsState : null;
  const slots = current?.slots ?? [];
  const slotsError = current?.error ?? null;
  const loadingSlots = slotsKey !== null && current === null;

  function handleSelectService(service: Service) {
    setSelected(service);
    setSelectedSlot(null);
    setNotice(null);
  }

  function handleChangeDate(newDate: string) {
    setDate(newDate);
    setSelectedSlot(null);
    setNotice(null);
  }

  function handleSelectSlot(slot: Slot) {
    setNotice(null);
    setSelectedSlot(slot);
  }

  function handleConflict() {
    setShowForm(false);
    setSelectedSlot(null);
    setNotice("Esse horário acabou de ser reservado. Escolha outro, por favor.");
    setRefreshKey((k) => k + 1);
  }

  function handleConfirmed(appointment: Appointment) {
    setShowForm(false);
    setConfirmed(appointment);
  }

  function handleReset() {
    setConfirmed(null);
    setShowForm(false);
    setSelected(null);
    setDate("");
    setSelectedSlot(null);
    setNotice(null);
    setRefreshKey((k) => k + 1);
  }

  const canConfirm = Boolean(selected && date && selectedSlot);

  // Tela de sucesso
  if (confirmed && selected && selectedSlot) {
    const firstName = confirmed.clientName.split(" ")[0];
    const contactMessage = `Olá! Aqui é ${firstName}. Tenho um agendamento de ${selected.name} em ${formatDateBR(date)} às ${selectedSlot.label} e preciso cancelar ou remarcar.`;

    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-petal-50 shadow-2xl shadow-petal-400/30">
        <Header />
        <main className="relative z-10 -mt-12 flex-1 px-5 pb-8">
          <div className="rounded-3xl bg-white p-8 text-center shadow-lg shadow-petal-300/40">
            <CheckCircle2 size={56} className="mx-auto text-petal-600" />
            <h2 className="mt-4 text-xl font-bold">Agendamento confirmado!</h2>
            <p className="mt-1 text-sm text-ink/60">Te esperamos, {firstName}.</p>

            <div className="mt-6 space-y-1 rounded-2xl bg-petal-100 p-4 text-sm">
              <p className="font-semibold">{selected.name}</p>
              <p>
                {formatDateBR(date)} às {selectedSlot.label}
              </p>
            </div>

            {whatsapp && (
              <div className="mt-5 rounded-2xl border border-petal-200 p-4 text-sm">
                <p className="text-ink/70">
                  Precisa cancelar ou remarcar? Fale direto com a profissional.
                </p>
                <a
                  href={whatsappLink(whatsapp, contactMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-petal-600 py-3 font-semibold text-petal-600 hover:bg-petal-50"
                >
                  <MessageCircle size={18} /> Falar com a profissional
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={handleReset}
              className="mt-6 w-full rounded-full bg-petal-600 py-4 font-semibold text-white shadow-lg shadow-petal-600/30 hover:bg-petal-700"
            >
              Fazer outro agendamento
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-petal-50 shadow-2xl shadow-petal-400/30">
      <Header />

      <main className="relative z-10 -mt-12 flex-1 space-y-7 px-5 pb-6">
        <DateStrip value={date} onChange={handleChangeDate} />

        {error && <p className="text-red-600">Erro ao carregar: {error}</p>}

        <ServiceSelector
          services={services}
          selectedId={selected?.id ?? null}
          onSelect={handleSelectService}
        />

        {notice && (
          <p className="rounded-2xl bg-petal-100 p-4 text-sm">{notice}</p>
        )}

        <TimeSlotGrid
          ready={Boolean(selected && date)}
          slots={slots}
          selectedStart={selectedSlot?.startTime ?? null}
          loading={loadingSlots}
          error={slotsError}
          onSelect={handleSelectSlot}
        />

        {whatsapp && (
          <p className="text-center text-xs text-ink/60">
            Precisa cancelar ou remarcar um horário?{" "}
            <a
              href={whatsappLink(whatsapp, "Olá! Preciso cancelar ou remarcar meu horário.")}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-petal-600 underline"
            >
              Fale com a profissional
            </a>
          </p>
        )}
      </main>

      <div className="sticky bottom-0 z-20 bg-linear-to-t from-petal-50 from-70% to-petal-50/0 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">
        {canConfirm && selected && selectedSlot && (
          <p className="mb-2 text-center text-xs text-ink/70">
            {selected.name} · {formatDateBR(date)} às {selectedSlot.label}
          </p>
        )}
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => setShowForm(true)}
          className="w-full rounded-full bg-petal-600 py-4 font-semibold text-white shadow-lg shadow-petal-600/30 transition hover:bg-petal-700 disabled:cursor-not-allowed disabled:bg-petal-300 disabled:shadow-none"
        >
          Confirmar Agendamento
        </button>
      </div>

      {showForm && selected && selectedSlot && (
        <BookingForm
          service={selected}
          date={date}
          slot={selectedSlot}
          onClose={() => setShowForm(false)}
          onConfirmed={handleConfirmed}
          onConflict={handleConflict}
        />
      )}
    </div>
  );
}
