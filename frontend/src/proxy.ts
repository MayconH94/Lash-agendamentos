import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/backend";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  const isLogin = request.nextUrl.pathname === "/admin/login";

  if (!token && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
