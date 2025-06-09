import { NextResponse } from "next/server";

export const POST = async (req) => {
  const { key } = await req.json();

  if (!key) {
    return NextResponse.json(
      { valid: false, error: "Missing API key" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(process.env.OPENROUTER_BASE_URL, {
      headers: {
        Authorization: `Bearer ${key}`,
      },
    });

    if (res.ok) {
      return NextResponse.json({ valid: true });
    } else if (res.status === 401 || res.status === 403) {
      return NextResponse.json(
        { valid: false, error: "Unauthorized" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { valid: false, error: "Unknown error" },
      { status: 500 }
    );
  } catch (err) {
    console.error("Error validating OpenRouter key:", err);
    return NextResponse.json(
      { valid: false, error: "Server error" },
      { status: 500 }
    );
  }
};
