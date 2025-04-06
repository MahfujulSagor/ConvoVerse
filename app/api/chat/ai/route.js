import { databases } from "@/lib/appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Query } from "appwrite";
import { decrypt, encrypt } from "@/lib/encrypt_decrypt";

export const POST = async (req) => {
  const { prompt, model_id } = await req.json();

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

  if (!prompt || !model_id) {
    return NextResponse.json(
      { error: "Missing required data" },
      { status: 400 }
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
      console.log(error);
      return NextResponse.json(
        { error: "Something went wrong fetching model name from Appwrite" },
        { status: 500 }
      );
    }
  }

  const modifiedPrompt = `Provide a short but complete answer to the following question: ${prompt}`;

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
            content: modifiedPrompt,
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
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
