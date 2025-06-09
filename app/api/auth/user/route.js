import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

export const POST = async (req) => {
  const { userId } = await req.json();
  const cookieStore = await cookies();

  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Unauthorized request!" },
      { status: 401 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { message: "User data not found!" },
      { status: 404 }
    );
  }

  try {
    //? Check if user data already exists
    const existingUser = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("$id", userId)]
    );

    if (existingUser?.total > 0) {
      return NextResponse.json(
        { message: "User data already exists!" },
        { status: 200 }
      );
    }

    const userData = {
      free_prompts: 3,
    };

    //* Store user data in Appwrite database
    const response = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId,
      userData
    );

    if (!response.$id) {
      return NextResponse.json(
        {
          message: "Failed to create user data!",
        },
        { status: 500 }
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

//* Get user data
export const GET = async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!userId) {
    return NextResponse.json(
      { message: "User data not found!" },
      { status: 404 }
    );
  }

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Unauthorized request!" },
      { status: 401 }
    );
  }

  try {
    const user = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId
    );

    if (!user) {
      return NextResponse.json(
        { message: "User data not found!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        free_prompts: user.free_prompts,
        has_api_key: user.api_key ? true : false,
      },
      {
        message: "User data fetched successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error while fetching user data: ", error);
    return NextResponse.json(
      { message: "Server Error" },
      {
        status: 500,
      }
    );
  }
};
