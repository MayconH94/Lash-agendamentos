import type { ReactNode } from "react";
import { AdminNav } from "@/components/AdminNav";
import { LogoutButton } from "@/components/LogoutButton";

export function AdminShell({ email, children }: { email?: string; children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-petal-50 lg:flex">
      <aside className="border-b border-petal-100 bg-white px-4 pb-3 pt-4 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <div className="flex items-center justify-between">
          <p className="font-serif text-xl font-semibold italic text-petal-700">
            Lash <span className="font-sans text-sm font-normal not-italic text-ink/50">painel</span>
          </p>
          <div className="lg:hidden">
            <LogoutButton />
          </div>
        </div>

        <AdminNav />

        <div className="mt-auto hidden lg:block">
          {email && <p className="mb-3 truncate text-xs text-ink/50">{email}</p>}
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
