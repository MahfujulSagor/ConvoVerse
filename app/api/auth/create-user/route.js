import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";

export const POST = async (req) => {
  const { userId } = await req.json();
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json({ message: "Unauthorized!" }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ message: "User data found!" }, { status: 404 });
  }

  try {
    const userData = {
      credits: 10,
    };

    // Store user data in Appwrite database
    const response = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId,
      userData
    );

    if (!response) {
      return NextResponse.json(
        {
          message: "User data not found!",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User created successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error while creating user data: ", error);
    cookieStore.delete("session_token");
    return NextResponse.json(
      { message: "Server Error" },
      {
        status: 500,
        headers: {
          "Set-Cookie": `session_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
        },
      }
    );
  }
};
