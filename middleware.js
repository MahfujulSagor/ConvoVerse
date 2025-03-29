import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/auth/get-started", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
