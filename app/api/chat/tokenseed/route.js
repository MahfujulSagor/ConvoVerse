import { databases } from "@/lib/appwrite";
import { NextResponse } from "next/server";

const PRICE_PER_CREDIT = 0.01; //? Price per credit in USD

export const PUT = async () => {
  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_AI_COLLECTION_ID
    );

    if (response.documents.length === 0) {
      return NextResponse.json({ message: "No models found" }, { status: 404 });
    }

    const data = response.documents;

    await Promise.all(
      data.map(async (model) => {
        const price = model.price_per_million_tokens;

        const tokens_per_credit = Math.floor(
          (PRICE_PER_CREDIT / price) * 1000000
        );

        try {
          const updated = await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_AI_COLLECTION_ID,
            model.$id,
            { tokens_per_credit: tokens_per_credit }
          );
          console.log(
            `Updated model ${model.name || model.$id} with tokens_per_credit: ${tokens_per_credit}`
          );
          return updated;
        } catch (e) {
          console.error(`Failed to update model ${model.$id}`, e);
          return null;
        }
      })
    );

    return NextResponse.json(
      { message: "Models updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/token:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
