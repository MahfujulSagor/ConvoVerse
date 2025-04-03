import { account } from "@/lib/appwrite";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Validate JWT by calling Appwrite to check the session
    const session = await account.getSession("current");

    if (!session || session.providerAccessToken !== token) {
      return NextResponse.json(
        { error: "Invalid or Expired Token" },
        { status: 401 }
      );
    }

    const user = await account.get();

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("JWT validation failed:", error);
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
};
