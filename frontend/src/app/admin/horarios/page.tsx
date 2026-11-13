import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { AdminShell } from "@/components/AdminShell";
import { HoursForm } from "@/components/HoursForm";
import type { WorkingDay } from "@/lib/adminApi";

export default async function AdminHoursPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const res = await fetch(`${BACKEND_URL}/api/admin/working-hours`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/admin/login");
  if (!res.ok) throw new Error("Falha ao carregar os horários");

  const week: WorkingDay[] = await res.json();

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl font-semibold text-ink lg:text-3xl">Horários de trabalho</h1>
      <p className="mt-1 text-ink/70">Defina os dias e o expediente que aparecem para as clientes.</p>
      <HoursForm initial={week} />
    </AdminShell>
  );
}
