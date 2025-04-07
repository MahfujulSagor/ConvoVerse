import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is required!" },
      { status: 400 }
    );
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Unauthorized request!" },
      { status: 401 }
    );
  }

  try {
    const user = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("user_id", userId)],
    );

    if (!user.documents || user.documents.length === 0) {
      return NextResponse.json(
        { error: "User not found!" },
        { status: 404 }
      );
    }

    const actualUserId = user.documents[0]?.$id;

    if (!actualUserId) {
      return NextResponse.json(
        { error: "Invalid user ID!" },
        { status: 400 }
      );
    }

    const historyTitle = `Chat with ${userId}`;

    const newHistory = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_HISTORY_COLLECTION_ID,
      ID.unique(),
      {
        user_id: actualUserId,
        title: historyTitle,
      }
    );

    if (!newHistory) {
      return NextResponse.json(
        { error: "Failed to create chat history" },
        { status: 500 }
      );
    }

    const historyId = newHistory.$id;

    return NextResponse.json(
      historyId,
      { message: "Chat history created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating chat history:", error);
    return NextResponse.json(
      { error: "Failed to create chat history" },
      { status: 500 }
    );
  }
};
