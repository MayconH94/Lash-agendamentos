import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";

export async function POST(request: Request) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const incoming = await request.formData();
  const file = incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Nenhuma foto enviada" }, { status: 400 });
  }

  const form = new FormData();
  form.append("file", file, "foto.jpg");

  const res = await fetch(`${BACKEND_URL}/api/admin/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}
