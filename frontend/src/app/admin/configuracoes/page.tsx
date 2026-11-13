import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { AdminShell } from "@/components/AdminShell";
import { SettingsForm } from "@/components/SettingsForm";
import type { Settings } from "@/lib/adminApi";

export default async function AdminSettingsPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const res = await fetch(`${BACKEND_URL}/api/admin/settings`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/admin/login");
  if (!res.ok) throw new Error("Falha ao carregar as configurações");

  const settings: Settings = await res.json();

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl font-semibold text-ink lg:text-3xl">Configurações</h1>
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}