import { databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { prompt, fullResponse } = await req.json();
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!prompt || !fullResponse) {
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

  console.log("Prompt:", prompt);
  console.log("Full Response:", fullResponse);

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
