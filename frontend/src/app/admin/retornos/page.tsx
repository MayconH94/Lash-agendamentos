import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { AdminShell } from "@/components/AdminShell";
import { ReturnsList } from "@/components/ReturnsList";
import type { ReturnItem } from "@/lib/adminApi";

export default async function AdminReturnsPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${BACKEND_URL}/api/admin/returns`, { headers, cache: "no-store" });
  if (res.status === 401) redirect("/admin/login");
  if (!res.ok) throw new Error("Falha ao carregar os retornos");

  const items: ReturnItem[] = await res.json();

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl font-semibold text-ink lg:text-3xl">Retornos</h1>
      <p className="mt-1 text-ink/70">
        Clientes que estão na hora da manutenção e ainda não têm novo horário marcado.
      </p>
      <ReturnsList items={items} />
    </AdminShell>
  );
}
