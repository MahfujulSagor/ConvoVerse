//* Calculates the token usage for a single conversation and returns the total credits used and cost based on the model's pricing
import { databases } from "@/lib/appwrite";
import { LlamaTokenizer } from "llama-tokenizer-js";
import { NextResponse } from "next/server";

export const PUT = async (req) => {
  const { modelId, prompt, aiResponse } = await req.json();

  if (!modelId || !prompt || !aiResponse) {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 }
    );
  }

  //* The input and aiResponse are concatenated to calculate the total tokens used
  const FULL_DATA = `${prompt}${aiResponse}`;

  const tokenizer = new LlamaTokenizer();

  const tokensUsed = tokenizer.encode(FULL_DATA);
  const totalTokens = tokensUsed.length;

  try {
    const model = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_AI_COLLECTION_ID,
      modelId
    );

    if (!model) {
      return NextResponse.json({ message: "Model not found" }, { status: 404 });
    }

    const tokens_per_credit = model?.tokens_per_credit;
    const price_per_million_tokens = model?.price_per_million_tokens;

    //* Calculate the total credits used keeping 2 decimal points for simplicity
    const total_credits_used = (totalTokens / tokens_per_credit).toFixed(2);

    //* Calculate the total cost based on the model's pricing
    const percision = 1000; //? 3 decimal points
    const total_raw_cost = (totalTokens / 1000000) * price_per_million_tokens;
    //? Round to 3 decimal points
    const total_cost = Math.ceil(total_raw_cost * percision) / percision;

    console.warn("Total Tokens: ", totalTokens);
    console.warn("Total Credits Used: ", total_credits_used);
    console.warn("Total Cost: ", total_cost);
    console.warn("Tokens per credit: ", tokens_per_credit);

    return NextResponse.json(
      {
        message: "Cost calculated successfully",
      },
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
