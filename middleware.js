import { NextResponse } from "next/server";

export function middleware(req) {
  const sessionToken = req.cookies.get("session_token");

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/get-started", req.url));
  }

  return NextResponse.next();
};

// Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*"], // Protect all /dashboard routes
};
