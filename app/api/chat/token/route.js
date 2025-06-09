//* Calculates the token usage for a single conversation and returns the total credits used and cost based on the model's pricing
import { databases } from "@/lib/appwrite";
// import { LlamaTokenizer } from "llama-tokenizer-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// export const PUT = async (req) => {
//   const { modelId, prompt, aiResponse, userId } = await req.json();

//   if (!modelId || !prompt || !aiResponse || !userId) {
//     return NextResponse.json(
//       { message: "Missing required params" },
//       { status: 400 }
//     );
//   }

//   //? Check if user is authorized
//   const cookieStore = await cookies();
//   const sessionToken = cookieStore.get("session_token")?.value;

//   if (!sessionToken) {
//     return NextResponse.json(
//       { message: "Unauthorized request" },
//       { status: 401 }
//     );
//   }

//   //* The input and aiResponse are concatenated to calculate the total tokens used
//   const FULL_DATA = `${prompt}${aiResponse}`;

//   const tokenizer = new LlamaTokenizer();

//   const tokensUsed = tokenizer.encode(FULL_DATA);
//   const totalTokens = tokensUsed.length;

//   let tokens_per_credit, price_per_million_tokens;

//   //* Check if the model pricing is cached in cookies
//   const cached_pricing_json = cookieStore.get("model_pricing")?.value;
//   const cachedPricing = cached_pricing_json
//     ? JSON.parse(cached_pricing_json)
//     : {};
//   const cachedModelId = cookieStore.get("model_id")?.value;

//   if (
//     modelId === cachedModelId &&
//     cachedPricing &&
//     cachedPricing.tokens_per_credit &&
//     cachedPricing.price_per_million_tokens
//   ) {
//     //! 🎯 Use cache
//     tokens_per_credit = cachedPricing.tokens_per_credit;
//     price_per_million_tokens = cachedPricing.price_per_million_tokens;
//   } else {
//     //* 🐢 Fallback to DB fetch
//     try {
//       const model = await databases.getDocument(
//         process.env.APPWRITE_DATABASE_ID,
//         process.env.APPWRITE_AI_COLLECTION_ID,
//         modelId
//       );

//       if (!model) {
//         return NextResponse.json(
//           { message: "Model not found" },
//           { status: 404 }
//         );
//       }

//       tokens_per_credit = model.tokens_per_credit;
//       price_per_million_tokens = model.price_per_million_tokens;

//       //? Cache the model pricing and id in cookies for 1 hour
//       const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
//       //? Model pricing object
//       const modelPricing = {
//         tokens_per_credit,
//         price_per_million_tokens,
//       };
//       cookieStore.set("model_pricing", JSON.stringify(modelPricing), {
//         expires,
//       });
//       cookieStore.set("model_id", modelId, {
//         expires,
//       });
//     } catch (error) {
//       console.error("Error fetching model pricing:", error);
//       return NextResponse.json(
//         { message: "Failed to fetch model pricing" },
//         { status: 500 }
//       );
//     }
//   }

//   //* Calculate the total credits used
//   const total_credits_used = parseFloat(
//     (totalTokens / tokens_per_credit).toFixed(3) //? 3 decimal points
//   );

//   //* Calculate the total cost based on the model's pricing in USD
//   const percision = 1000; //? 3 decimal points
//   const total_raw_cost = (totalTokens / 1000000) * price_per_million_tokens;
//   //? Round to 3 decimal points
//   const total_cost = Math.ceil(total_raw_cost * percision) / percision;

//   try {
//     //* Check if the user has enough credits to cover the cost
//     const user = await databases.getDocument(
//       process.env.APPWRITE_DATABASE_ID,
//       process.env.APPWRITE_USERS_COLLECTION_ID,
//       userId
//     );

//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     const user_credits = user?.credits;

//     const new_credits = user_credits - total_credits_used;

//     if (new_credits <= 0) {
//       return NextResponse.json(
//         { message: "Not enough credits" },
//         { status: 402 }
//       );
//     }

//     //* Update the user's credits in the database
//     const updatedUser = await databases.updateDocument(
//       process.env.APPWRITE_DATABASE_ID,
//       process.env.APPWRITE_USERS_COLLECTION_ID,
//       userId,
//       {
//         credits: new_credits,
//       }
//     );

//     if (!updatedUser) {
//       return NextResponse.json(
//         { message: "Failed to update user credits" },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         message: "Cost calculated and deducted successfully",
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Cost update error", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// };

//* Calculates the users remaining free prompts
export const PUT = async (req) => {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json(
      { message: "Missing required params" },
      { status: 400 }
    );
  }

  //? Check if user is authorized
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { message: "Unauthorized request" },
      { status: 401 }
    );
  }

  try {
    //? Fetch the user from the database
    const user = await databases.getDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.free_prompts <= 0) {
      return NextResponse.json(
        { message: "No free prompts left" },
        { status: 403 }
      );
    }

    //? Update the user's remaining prompts
    const updatedUser = await databases.updateDocument(
      process.env.APPWRITE_DATABASE_ID,
      process.env.APPWRITE_USERS_COLLECTION_ID,
      userId,
      {
        free_prompts: user.free_prompts - 1,
      }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "Failed to update user remaining prompts" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Users remaining prompts updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating users remaining prompts:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
