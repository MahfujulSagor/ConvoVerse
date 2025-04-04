import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export const POST = async (req) => {
  const { user } = await req.json();
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "Unauthorized!", status: 401 });
  }
  if (!user) {
    return NextResponse.json({ message: "User not found!", status: 404 });
  }

  try {
    console.log(user);

    return NextResponse.json({ message: "Success", status: 200 }); // Ensure a response is returned
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error", status: 500 });
  }
};
