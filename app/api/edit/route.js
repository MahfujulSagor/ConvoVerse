import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { NextResponse } from "next/server";

export const PUT = async () => {
  try {
    const users = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      [Query.equal("free_prompts", 3)]
    );

    await Promise.all(
      users.documents.map((user) => {
        databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_USERS_COLLECTION_ID,
          user.$id,
          {
            free_prompts: 5,
          }
        );
      })
    );

    return NextResponse.json(
      { message: "Users free prompts updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /edit:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
};
