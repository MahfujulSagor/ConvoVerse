import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { prompt } = await req.json();

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;

  if (!sessionToken) {
    return NextResponse.json(
      { error: "Unauthorized request" },
      { status: 401 }
    );
  }

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      process.env.DEEPSEEK_BASE_URL,
      {
        model: "deepseek/deepseek-chat-v3-0324:free", //! Replace with the model from client
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
          // "HTTP-Referer": "website.com", //! Replace with the domain
        },
      }
    );

    const data = response.data;

    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
