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
  maintenanceDays: number | null;
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
  maintenanceDays: number | null;
};

export type WorkingInterval = { start: string; end: string };
export type WorkingDay = { dayOfWeek: number; intervals: WorkingInterval[] };

export type TimeOff = { id: string; startTime: string; endTime: string; reason: string | null };
export type TimeOffPayload = {
  date: string;
  allDay: boolean;
  start: string | null;
  end: string | null;
  reason: string | null;
};

export type ReturnItem = {
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  lastVisit: string;
  dueDate: string;
  daysOverdue: number;
};

export type Settings = { whatsapp: string | null };

export type AdminAppointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  price: number;
  startTime: string;
  endTime: string;
  status: string;
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
  createTimeOff: (body: TimeOffPayload) =>
    call<TimeOff>("time-off", { method: "POST", body: JSON.stringify(body) }),
  deleteTimeOff: async (id: string) => {
    const res = await fetch(`/admin-api/time-off/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      window.location.href = "/admin/login";
      throw new Error("Sessão expirada");
    }
    if (!res.ok) throw new Error("Não foi possível remover a folga.");
  },
  saveWorkingHours: (week: WorkingDay[]) =>
    call<WorkingDay[]>("working-hours", { method: "PUT", body: JSON.stringify(week) }),
  listAppointments: (date: string) =>
    call<AdminAppointment[]>(`appointments?date=${date}`),
  cancelAppointment: (id: string) =>
    call<AdminAppointment>(`appointments/${id}/cancel`, { method: "PATCH" }),
  uploadImage,
  updateSettings: (whatsapp: string | null) =>
    call<Settings>("settings", { method: "PUT", body: JSON.stringify({ whatsapp }) }),
  createService: (body: ServicePayload) =>
    call<AdminService>("services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id: string, body: ServicePayload) =>
    call<AdminService>(`services/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  setActive: (id: string, active: boolean) =>
    call<AdminService>(`services/${id}/active`, { method: "PATCH", body: JSON.stringify({ active }) }),
  createCategory: (name: string, displayOrder: number) =>
    call<Category>("categories", { method: "POST", body: JSON.stringify({ name, displayOrder }) }),
};
