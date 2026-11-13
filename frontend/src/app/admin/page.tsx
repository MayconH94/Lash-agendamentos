import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { AdminShell } from "@/components/AdminShell";

export default async function AdminHomePage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/admin/login");

  const res = await fetch(`${BACKEND_URL}/api/admin/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) redirect("/admin/login");

  const me: { email: string } = await res.json();

  return (
    <AdminShell email={me.email}>
      <h1 className="font-serif text-2xl font-semibold text-ink lg:text-3xl">Olá!</h1>
      <p className="mt-1 text-ink/70">Escolha o que você quer gerenciar.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Link
          href="/admin/servicos"
          className="block rounded-2xl bg-white p-5 font-semibold text-ink shadow-sm transition hover:shadow-md"
        >
          Serviços
          <span className="mt-1 block text-sm font-normal text-ink/60">Criar, editar e ocultar serviços</span>
        </Link>
        <div className="rounded-2xl bg-white/60 p-5 text-ink/40">
          Horários de trabalho
          <span className="mt-1 block text-sm">Em breve</span>
        </div>
        <Link
          href="/admin/agenda"
          className="block rounded-2xl bg-white p-5 font-semibold text-ink shadow-sm transition hover:shadow-md"
        >
          Agenda
          <span className="mt-1 block text-sm font-normal text-ink/60">Ver, cancelar e chamar clientes no WhatsApp</span>
        </Link>
      </div>
    </AdminShell>
  );
}
