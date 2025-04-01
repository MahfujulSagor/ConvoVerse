import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { name } = await params;

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!name) {
    return new Response("Model name is required", { status: 400 });
  }

  try {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_AI_COLLECTION_ID,
      [Query.equal("name", name)]
    );

    const models = response.documents.map(({display_name, name, $id}) => ({
      $id,
      name,
      display_name
    }));

    if (models.length === 0) {
      return new Response("Model not found", { status: 404 });
    }

    return NextResponse.json(models, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching models:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};
