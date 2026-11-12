"use client";

import { useState, type FormEvent } from "react";
import { adminApi, type AdminService, type Category } from "@/lib/adminApi";

type Props = {
  service: AdminService | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
};

const inputClass =
  "mt-1 w-full rounded-2xl border border-petal-200 bg-white px-4 py-3 text-ink outline-none focus:border-petal-600";

export function ServiceForm({ service, categories, onClose, onSaved }: Props) {
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [imageUrl, setImageUrl] = useState(service?.imageUrl ?? "");
  const [categoryId, setCategoryId] = useState(service?.categoryId ?? "");
  const [duration, setDuration] = useState(String(service?.durationMinutes ?? 60));
  const [buffer, setBuffer] = useState(String(service?.bufferMinutes ?? 15));
  const [price, setPrice] = useState(service ? String(service.price).replace(".", ",") : "");
  const [order, setOrder] = useState(String(service?.displayOrder ?? 0));

  const [extraCategories, setExtraCategories] = useState<Category[]>([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const allCategories = [
    ...categories,
    ...extraCategories.filter((e) => !categories.some((c) => c.id === e.id)),
  ];

  async function createCategory() {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    setError(null);
    try {
      const created = await adminApi.createCategory(trimmed, allCategories.length + 1);
      setExtraCategories((prev) => [...prev, created]);
      setCategoryId(created.id);
      setNewCategory("");
      setShowNewCategory(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao criar categoria");
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const body = {
      name: name.trim(),
      description: description.trim() || null,
      imageUrl: imageUrl.trim() || null,
      categoryId: categoryId || null,
      displayOrder: Number(order) || 0,
      durationMinutes: Number(duration),
      bufferMinutes: Number(buffer),
      price: Number(price.replace(",", ".")),
    };

    if (!body.name) return setError("Informe o nome do serviço.");
    if (!(body.durationMinutes >= 5)) return setError("A duração mínima é 5 minutos.");
    if (!(body.bufferMinutes >= 0)) return setError("O intervalo não pode ser negativo.");
    if (!(body.price >= 0)) return setError("Informe um preço válido.");

    setSaving(true);
    try {
      if (service) await adminApi.updateService(service.id, body);
      else await adminApi.createService(body);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/40" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="mx-auto max-h-[92vh] w-full max-w-md space-y-4 overflow-y-auto rounded-t-3xl bg-petal-50 p-6"
      >
        <h2 className="font-serif text-xl font-semibold text-ink">
          {service ? "Editar serviço" : "Novo serviço"}
        </h2>

        <label className="block">
          <span className="text-sm font-medium text-ink">Nome</span>
          <input className={inputClass} value={name} maxLength={100} onChange={(e) => setName(e.target.value)} />
        </label>

        <div>
          <label className="block">
            <span className="text-sm font-medium text-ink">Categoria</span>
            <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Sem categoria</option>
              {allCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          {showNewCategory ? (
            <div className="mt-2 flex gap-2">
              <input
                className="w-full rounded-2xl border border-petal-200 bg-white px-4 py-2 text-ink outline-none focus:border-petal-600"
                placeholder="Nome da categoria"
                value={newCategory}
                maxLength={100}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button type="button" onClick={createCategory} className="rounded-full bg-petal-600 px-4 text-sm font-semibold text-white">
                Criar
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setShowNewCategory(true)} className="mt-2 text-sm font-semibold text-petal-600">
              + Criar categoria
            </button>
          )}
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink">Descrição</span>
          <textarea className={inputClass} rows={2} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Link da foto (opcional)</span>
          <input className={inputClass} type="url" placeholder="https://..." value={imageUrl} maxLength={500} onChange={(e) => setImageUrl(e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-sm font-medium text-ink">Duração (min)</span>
            <input className={inputClass} inputMode="numeric" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Intervalo (min)</span>
            <input className={inputClass} inputMode="numeric" value={buffer} onChange={(e) => setBuffer(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Preço (R$)</span>
            <input className={inputClass} inputMode="decimal" placeholder="250,00" value={price} onChange={(e) => setPrice(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-ink">Ordem</span>
            <input className={inputClass} inputMode="numeric" value={order} onChange={(e) => setOrder(e.target.value)} />
          </label>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-petal-100 px-3 py-2 text-sm text-petal-700">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-full border border-petal-600 py-3 font-semibold text-petal-600">
            Cancelar
          </button>
          <button type="submit" disabled={saving} className="flex-1 rounded-full bg-petal-600 py-3 font-semibold text-white disabled:opacity-60">
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
