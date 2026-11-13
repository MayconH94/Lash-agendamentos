import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "@/lib/backend";
import { AdminShell } from "@/components/AdminShell";
import { AgendaView } from "@/components/AgendaView";

export default async function AdminAgendaPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  return (
    <AdminShell>
      <h1 className="font-serif text-2xl font-semibold text-ink lg:text-3xl">Agenda</h1>
      <AgendaView />
    </AdminShell>
  );
}
