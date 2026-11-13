import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { AdminShell } from "@/components/AdminShell";
import { TimeOffManager } from "@/components/TimeOffManager";
import type { TimeOff } from "@/lib/adminApi";

export default async function AdminTimeOffPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const res = await fetch(`${BACKEND_URL}/api/admin/time-off`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (res.status === 401) redirect("/admin/login");
  if (!res.ok) throw new Error("Falha ao carregar as folgas");

  const items: TimeOff[] = await res.json();

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl font-semibold text-ink lg:text-3xl">Folgas e feriados</h1>
      <p className="mt-1 text-ink/70">Os horários bloqueados deixam de aparecer para as clientes.</p>
      <TimeOffManager initial={items} />
    </AdminShell>
  );
}
