import { databases } from "@/lib/appwrite";
import { encrypt } from "@/lib/encrypt_decrypt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { key, userId } = await req.json();

  if (!key || !userId) {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 }
    );
  }

  //? Check if user is authorized
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  try {
    //? Fetch the user from the database
    const user = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    //! 🔐 Encrypt the key before saving
    const { encrypted, iv } = encrypt(key);

    //? Update the user data
    const updatedUser = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId,
      {
        api_key: encrypted,
        api_iv: iv,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Failed to save api key" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Api key saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving api key", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
