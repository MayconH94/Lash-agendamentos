import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";
import { LogoutButton } from "@/components/LogoutButton";

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
    <main className="mx-auto min-h-screen max-w-md bg-petal-50 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-ink">Painel</h1>
        <LogoutButton />
      </div>
      <p className="mt-4 text-ink/70">
        Olá, <strong>{me.email}</strong>.
      </p>

      <nav className="mt-6 space-y-3">
        <Link
          href="/admin/servicos"
          className="block rounded-2xl bg-white p-4 font-semibold text-ink shadow-sm hover:bg-petal-100"
        >
          Serviços
          <span className="block text-sm font-normal text-ink/60">Criar, editar e ocultar serviços</span>
        </Link>
        <div className="rounded-2xl bg-white/60 p-4 text-ink/40">
          Horários de trabalho
          <span className="block text-sm">Em breve</span>
        </div>
        <div className="rounded-2xl bg-white/60 p-4 text-ink/40">
          Agenda
          <span className="block text-sm">Em breve</span>
        </div>
      </nav>
    </main>
  );
}
