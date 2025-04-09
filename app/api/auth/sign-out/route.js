import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async () => {
  const cookieStore = await cookies();

  try {
    // Delete the session token from the cookieStore (request level)
    cookieStore.delete("session_token");

    // Set the cookie to expire immediately in the response
    return NextResponse.json(
      { message: "Logged out" },
      {
        status: 200,
        headers: {
          "Set-Cookie": `session_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
