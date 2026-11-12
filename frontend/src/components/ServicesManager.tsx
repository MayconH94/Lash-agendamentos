"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Plus, Sparkles } from "lucide-react";
import { adminApi, type AdminService, type Category } from "@/lib/adminApi";
import { ServiceForm } from "@/components/ServiceForm";
import { formatDuration } from "@/lib/duration";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function ServicesManager({
  services,
  categories,
}: {
  services: AdminService[];
  categories: Category[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminService | "new" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleActive(service: AdminService) {
    setError(null);
    try {
      await adminApi.setActive(service.id, !service.active);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao atualizar");
    }
  }

  const groups = new Map<string, AdminService[]>();
  for (const s of services) {
    const key = s.categoryName ?? "Sem categoria";
    groups.set(key, [...(groups.get(key) ?? []), s]);
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">Serviços</h1>
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-1 rounded-full bg-petal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-petal-700"
        >
          <Plus size={16} /> Novo
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-petal-100 px-3 py-2 text-sm text-petal-700">{error}</p>
      )}

      {services.length === 0 && (
        <p className="mt-6 text-ink/60">Nenhum serviço cadastrado ainda. Toque em “Novo” para começar.</p>
      )}

      {Array.from(groups.entries()).map(([category, items]) => (
        <section key={category} className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-petal-600">{category}</h2>
          <ul className="space-y-3">
            {items.map((s) => (
              <li
                key={s.id}
                className={`rounded-2xl bg-white p-3 shadow-sm ${s.active ? "" : "opacity-60"}`}
              >
                <div className="flex gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-petal-100 text-petal-600">
                    {s.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.imageUrl} alt={s.name} className="h-full w-full object-cover" />
                    ) : (
                      <Sparkles size={24} />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-ink">{s.name}</p>
                      <p className="shrink-0 font-semibold text-petal-600">{brl.format(s.price)}</p>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/60">
                      <Clock size={12} /> {formatDuration(s.durationMinutes)} · +{s.bufferMinutes} min de intervalo
                    </p>
                    {s.description && <p className="mt-1 text-xs text-ink/60">{s.description}</p>}
                    {!s.active && (
                      <span className="mt-1 inline-block rounded-full bg-petal-100 px-2 py-0.5 text-xs font-semibold text-petal-700">
                        Oculto
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setEditing(s)}
                    className="flex-1 rounded-full border border-petal-600 py-2 text-sm font-semibold text-petal-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleActive(s)}
                    className="flex-1 rounded-full bg-petal-100 py-2 text-sm font-semibold text-petal-700"
                  >
                    {s.active ? "Ocultar" : "Reativar"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {editing && (
        <ServiceForm
          key={editing === "new" ? "new" : editing.id}
          service={editing === "new" ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
