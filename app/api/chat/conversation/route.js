import { databases } from "@/lib/appwrite";
import { ID, Query } from "appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { prompt, fullResponse, historyId } = await req.json();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!prompt || !fullResponse || !historyId) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }

  try {
    const userPrompt = {
      role: "user",
      content: prompt,
    };

    const assistantResponse = {
      role: "assistant",
      content: fullResponse,
    };

    const conversation = await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_CONVERSATIONS_COLLECTION_ID,
      ID.unique(),
      {
        messages: [
          JSON.stringify(userPrompt),
          JSON.stringify(assistantResponse),
        ],
        history_id: historyId,
      }
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Failed to save history" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { messages: "History saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error while saving history: ", error);
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
};

//* Handle fetch conversation
export const GET = async (req) => {
  const url = new URL(req.url);
  const historyId = url.searchParams.get("historyId");

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!historyId) {
    return NextResponse.json({ error: "Missing historyId" }, { status: 400 });
  }

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }

  try {
    const conversations = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_CONVERSATIONS_COLLECTION_ID,
      [
        Query.equal("history_id", historyId),
        Query.orderAsc("$createdAt"),
        Query.limit(10), //? Limit to 10 conversations
      ]
    );

    if (conversations.documents.length === 0) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const messages = conversations.documents?.flatMap((doc) => {
      return doc.messages
        .map((messageString) => {
          try {
            const parsedMessage = JSON.parse(messageString);
            return {
              role: parsedMessage.role,
              content: parsedMessage.content,
            };
          } catch (e) {
            console.error("Failed to parse message:", messageString, e);
            return null;
          }
        })
        .filter(Boolean);
    });

    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error("Server error while fetching conversation: ", error);
    return NextResponse.json(
      { error: "Server Error" },
      {
        status: 500,
      }
    );
  }
};
