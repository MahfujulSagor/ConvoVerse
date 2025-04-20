import { databases } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { decrypt, encrypt } from "@/lib/encrypt_decrypt";
import { summarizer } from "@/lib/summarizer";

export const POST = async (req) => {
  const { prompt, model_id, userId, historyId } = await req.json();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  const cachedModelId = cookieStore.get("model_id")?.value;
  const cachedModelNameEncrypted = cookieStore.get("model_name_hash")?.value;
  const cachedIv = cookieStore.get("model_name_iv")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }

  if (!prompt || !model_id || !historyId || !userId) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
    );
  }

  try {
    const userResponse = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId
    );

    if (!userResponse) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userCredits = userResponse.credits;

    if (userCredits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Server error while checking user credits", error);
    return NextResponse.json(
      { error: "Something went wrong checking user credits" },
      { status: 500 }
    );
  }

  let AI_MODEL_NAME = "";

  if (cachedModelId === model_id && cachedModelNameEncrypted && cachedIv) {
    // Decrypt the cached model name
    const decryptedModelName = decrypt(cachedModelNameEncrypted, cachedIv);
    AI_MODEL_NAME = decryptedModelName;
  } else {
    try {
      const appwriteResponse = await databases.listDocuments(
        process.env.APPWRITE_DATABASE_ID,
        process.env.APPWRITE_AI_COLLECTION_ID,
        [Query.equal("$id", model_id)]
      );

      if (appwriteResponse.documents.length > 0) {
        const modelName = appwriteResponse.documents[0].model_name;

        const { encrypted, iv: encryptionIV } = encrypt(modelName);

        cookieStore.set("model_id", model_id);
        cookieStore.set("model_name_hash", encrypted);
        cookieStore.set("model_name_iv", encryptionIV);

        AI_MODEL_NAME = modelName;
      } else {
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Something went wrong fetching model name from Appwrite" },
        { status: 500 }
      );
    }
  }

  const conversations_history = await databases.listDocuments(
    process.env.APPWRITE_DATABASE_ID,
    process.env.APPWRITE_CONVERSATIONS_COLLECTION_ID,
    [
      Query.equal("history_id", historyId),
      Query.limit(5),
      Query.orderAsc("$createdAt"),
    ]
  );

  let contextSummary = "";

  if (
    conversations_history?.documents?.length &&
    conversations_history.documents.length > 0
  ) {
    const last_5_conversations = conversations_history.documents;
    contextSummary = summarizer(last_5_conversations);
  } else {
    contextSummary =
      "This is the user's first interaction. No previous context is available."; //? No previous context available
  }

  const short_modified_prompt = `provide a short but complete answer to the following prompt (NOTE: if greating type prompt keep it short): ${prompt}`;

  const final_modified_prompt = `Context: "${contextSummary}"\n\nNow ${short_modified_prompt}`; //? Final prompt to be sent to the AI model

  try {
    const response = await fetch(process.env.OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: AI_MODEL_NAME,
        messages: [
          {
            role: "user",
            content: final_modified_prompt,
          },
        ],
        stream: true,
      }),
    });

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
