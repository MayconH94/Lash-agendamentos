"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin-session", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="rounded-full border border-petal-600 px-4 py-2 text-sm font-semibold text-petal-600 hover:bg-petal-100"
    >
      Sair
    </button>
  );
}
