import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { sessionToken } = await req.json();
  const cookieStore = await cookies();

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Session data is required" },
      { status: 400 }
    );
  }

  try {
    // Set HTTP-only cookie
    cookieStore.set("session_token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    return NextResponse.json(
      { message: "Session stored in cookie" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error storing session:", error);
    return NextResponse.json(
      { error: "Failed to store session" },
      { status: 500 }
    );
  }
}
