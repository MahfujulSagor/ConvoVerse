import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  const url = new URL(req.url);

  if (sessionToken && url.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!sessionToken && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/get-started", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
