import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { AdminShell } from "@/components/AdminShell";
import { ServicesManager } from "@/components/ServicesManager";
import type { AdminService, Category } from "@/lib/adminApi";

async function getAdmin<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BACKEND_URL}/api/admin/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/admin/login");
  if (!res.ok) throw new Error(`Falha ao carregar ${path}`);
  return res.json();
}

export default async function AdminServicesPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const [services, categories] = await Promise.all([
    getAdmin<AdminService[]>("services", token),
    getAdmin<Category[]>("categories", token),
  ]);

  return (
    <AdminShell>
      <ServicesManager services={services} categories={categories} />
    </AdminShell>
  );
}
