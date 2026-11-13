import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { BACKEND_URL, TOKEN_COOKIE } from "@/lib/backend";

async function forward(
  request: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const { path } = await ctx.params;
  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const res = await fetch(`${BACKEND_URL}/api/admin/${path.join("/")}${new URL(request.url).search}`, {
    method: request.method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: hasBody ? await request.text() : undefined,
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
  });
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
