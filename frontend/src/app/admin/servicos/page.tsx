import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
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
    <main className="mx-auto min-h-screen max-w-md bg-petal-50 px-6 py-8">
      <Link href="/admin" className="mb-4 inline-block text-sm font-semibold text-petal-600">
        ← Painel
      </Link>
      <ServicesManager services={services} categories={categories} />
    </main>
  );
}
