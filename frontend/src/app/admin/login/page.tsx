"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? "E-mail ou senha inválidos");
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Não foi possível conectar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center bg-gradient-to-b from-petal-300 to-petal-100 px-6">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl bg-petal-50 p-6 shadow-lg"
      >
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Área da profissional</h1>
          <p className="mt-1 text-sm text-ink/60">Entre para gerenciar serviços e horários.</p>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-ink">E-mail</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-petal-200 bg-white px-4 py-3 text-ink outline-none focus:border-petal-600"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Senha</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-petal-200 bg-white px-4 py-3 text-ink outline-none focus:border-petal-600"
          />
        </label>

        {error && (
          <p role="alert" className="rounded-xl bg-petal-100 px-3 py-2 text-sm text-petal-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-petal-600 py-3 font-semibold text-white transition hover:bg-petal-700 disabled:opacity-60"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
