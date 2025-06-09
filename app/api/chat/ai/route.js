export const runtime = "nodejs";

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

  let userResponse;

  try {
    userResponse = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId
    );

    if (!userResponse) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userFreePrompts = userResponse.free_prompts;

    if (userFreePrompts <= 0) {
      return NextResponse.json(
        { error: "Insufficient free prompts" },
        { status: 403 }
      );
    }
  } catch (error) {
    console.error("Server error while checking user free prompts", error);
    return NextResponse.json(
      { error: "Something went wrong checking user free prompts" },
      { status: 500 }
    );
  }

  let AI_MODEL_NAME = "";

  if (cachedModelId === model_id && cachedModelNameEncrypted && cachedIv) {
    //! Decrypt the cached model name
    try {
      const decryptedModelName = decrypt(cachedModelNameEncrypted, cachedIv);
      AI_MODEL_NAME = decryptedModelName;
    } catch (e) {
      console.warn("⚠️ Failed to decrypt cached model name");
    }
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
        console.log("✅ Model name fetched from Appwrite:", AI_MODEL_NAME);
      } else {
        console.error("❌ No model found with id:", model_id);
        return NextResponse.json({ error: "Model not found" }, { status: 404 });
      }
    } catch (error) {
      console.error("❌ Error fetching model from Appwrite", error);
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

  if (!AI_MODEL_NAME) {
    console.error("❌ AI_MODEL_NAME is undefined or empty");
    return NextResponse.json({ error: "Model name missing" }, { status: 400 });
  }

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

  //! 🔐 Decrypt user API key
  let API_KEY = process.env.OPENROUTER_API_KEY; //? fallback default
  try {
    const user_api_key = userResponse.api_key;
    const user_api_iv = userResponse.api_iv;

    if (user_api_key && user_api_iv) {
      const decryptedKey = decrypt(user_api_key, user_api_iv);
      if (decryptedKey?.trim()) {
        API_KEY = decryptedKey;
      }
    }
  } catch (error) {
    console.warn("⚠️ Error decrypting user API key", error);
  }

  if (!API_KEY) {
    console.error("❌ No API key available for OpenRouter");
    return NextResponse.json(
      { error: "No API key available" },
      { status: 500 }
    );
  }

  try {
    //* 🤖 Call OpenRouter
    const response = await fetch(process.env.OPENROUTER_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
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

    if (!response.ok || !response.body) {
      const errText = await response.text();
      console.error("OpenRouter FAILED", {
        status: response.status,
        statusText: response.statusText,
        errorText: errText,
      });
      return NextResponse.json(
        { error: "OpenRouter returned no body" },
        { status: 500 }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("❌ Exception during OpenRouter fetch", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
