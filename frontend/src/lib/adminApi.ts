export type Category = {
  id: string;
  name: string;
  displayOrder: number;
};

export type AdminService = {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: string | null;
  categoryName: string | null;
  displayOrder: number;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
  active: boolean;
};

export type ServicePayload = {
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: string | null;
  displayOrder: number;
  durationMinutes: number;
  bufferMinutes: number;
  price: number;
};

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/admin-api/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json" },
  });

  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Sessão expirada");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? data?.message ?? "Não foi possível salvar. Verifique os campos.");
  }
  return res.json();
}

async function uploadImage(blob: Blob): Promise<{ url: string }> {
  const form = new FormData();
  form.append("file", blob, "foto.jpg");
  const res = await fetch("/admin-api/upload", { method: "POST", body: form });

  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Sessão expirada");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.detail ?? data?.message ?? "Não foi possível enviar a foto.");
  }
  return res.json();
}

export const adminApi = {
  uploadImage,
  createService: (body: ServicePayload) =>
    call<AdminService>("services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id: string, body: ServicePayload) =>
    call<AdminService>(`services/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  setActive: (id: string, active: boolean) =>
    call<AdminService>(`services/${id}/active`, { method: "PATCH", body: JSON.stringify({ active }) }),
  createCategory: (name: string, displayOrder: number) =>
    call<Category>("categories", { method: "POST", body: JSON.stringify({ name, displayOrder }) }),
};
