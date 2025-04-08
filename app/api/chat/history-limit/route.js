import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const MAX_CHAT_HISTORY_COUNT = 30; //! Maximum number of chat histories allowed

export const GET = async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required" },
      { status: 400 }
    );
  }

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Unauthorized request!" },
      { status: 401 }
    );
  }

  try {
    const histories = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_HISTORY_COLLECTION_ID,
      [Query.equal("user_id", userId), Query.limit(1)], //? Limit to 1 document but still get the total count
    );

    if (!histories.documents || histories.documents.length === 0) {
      return NextResponse.json(
        { message: "No chat history found" },
        { status: 404 }
      );
    }

    const chatHistoryCount = histories.total || 0;

    if (chatHistoryCount >= MAX_CHAT_HISTORY_COUNT) {
      return NextResponse.json(
        {
          message: `Chat creation limit reached`,
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { count: chatHistoryCount, message: "Chat history creation allowed" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking chat history creation permission", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
