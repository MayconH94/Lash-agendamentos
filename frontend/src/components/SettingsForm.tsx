"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminApi, type Settings } from "@/lib/adminApi";
import { whatsappLink } from "@/lib/whatsapp";

function mask(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function SettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState(mask(initial.whatsapp ?? ""));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digits = whatsapp.replace(/\D/g, "");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (digits.length > 0 && digits.length < 10) {
      return setError("Informe o DDD e o número completo.");
    }

    setSaving(true);
    try {
      await adminApi.updateSettings(digits || null);
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-lg space-y-4 rounded-2xl bg-white p-5 shadow-sm">
      <label className="block">
        <span className="text-sm font-medium text-ink">WhatsApp da profissional</span>
        <input
          className="mt-1 w-full rounded-2xl border border-petal-200 bg-white px-4 py-3 text-ink outline-none focus:border-petal-600"
          inputMode="tel"
          placeholder="(11) 99999-0000"
          value={whatsapp}
          onChange={(e) => {
            setWhatsapp(mask(e.target.value));
            setSaved(false);
          }}
        />
        <span className="mt-1 block text-xs text-ink/50">
          As clientes usam este número para falar com você, por exemplo para cancelar ou remarcar um horário.
        </span>
      </label>

      {error && (
        <p role="alert" className="rounded-xl bg-petal-100 px-3 py-2 text-sm text-petal-700">{error}</p>
      )}
      {saved && <p className="rounded-xl bg-petal-100 px-3 py-2 text-sm text-petal-700">Configurações salvas.</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-petal-600 px-6 py-3 font-semibold text-white hover:bg-petal-700 disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar"}
        </button>
        {digits.length >= 10 && (
          <a
            href={whatsappLink(digits, "Olá! Este é um teste do link do WhatsApp.")}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-petal-600 px-6 py-3 font-semibold text-petal-600 hover:bg-petal-50"
          >
            Testar link
          </a>
        )}
      </div>
    </form>
  );
}