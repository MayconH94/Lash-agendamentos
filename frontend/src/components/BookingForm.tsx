"use client";

import { useState } from "react";
import { X } from "lucide-react";
import {
  ApiError,
  bookAppointment,
  type Appointment,
  type Service,
  type Slot,
} from "@/lib/api";
import { formatDateBR } from "@/lib/dates";
import { formatPhone, onlyDigits } from "@/lib/phone";

type Props = {
  service: Service;
  date: string;
  slot: Slot;
  onClose: () => void;
  onConfirmed: (appointment: Appointment) => void;
  onConflict: () => void;
};

export default function BookingForm({
  service,
  date,
  slot,
  onClose,
  onConfirmed,
  onConflict,
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conflict, setConflict] = useState(false);

  const nameOk = name.trim().length >= 2;
  const phoneOk = onlyDigits(phone).length === 11;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nameOk || !phoneOk || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const appointment = await bookAppointment({
        clientName: name.trim(),
        clientPhone: onlyDigits(phone),
        serviceId: service.id,
        startTime: slot.startTime,
      });
      onConfirmed(appointment);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setConflict(true);
      } else {
        setError(
          err instanceof Error ? err.message : "Não foi possível agendar. Tente de novo."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-2xl border-2 border-petal-200 bg-petal-50 px-4 py-3 outline-none transition focus:border-petal-500";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold">Seus dados</h2>
            <p className="text-sm text-ink/60">
              {service.name} · {formatDateBR(date)} às {slot.label}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-full p-1.5 text-ink/60 hover:bg-petal-100"
          >
            <X size={20} />
          </button>
        </div>

        {conflict ? (
          <div className="space-y-4">
            <p className="rounded-2xl bg-petal-100 p-4 text-sm">
              Que pena! Esse horário acabou de ser reservado por outra cliente.
              Vamos atualizar a lista para você escolher outro.
            </p>
            <button
              type="button"
              onClick={onConflict}
              className="w-full rounded-full bg-petal-600 py-4 font-semibold text-white shadow-lg shadow-petal-600/30 hover:bg-petal-700"
            >
              Escolher outro horário
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm font-medium">Seu nome</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como podemos te chamar?"
                autoComplete="name"
                maxLength={150}
                className={inputClass}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm font-medium">WhatsApp</span>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(11) 99999-0000"
                autoComplete="tel"
                className={inputClass}
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={!nameOk || !phoneOk || submitting}
              className="w-full rounded-full bg-petal-600 py-4 font-semibold text-white shadow-lg shadow-petal-600/30 transition hover:bg-petal-700 disabled:cursor-not-allowed disabled:bg-petal-300 disabled:shadow-none"
            >
              {submitting ? "Agendando..." : "Confirmar Agendamento"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
