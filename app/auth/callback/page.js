"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        // Create jwt token
        const jwt = await account.createJWT();
        if (!jwt || !jwt.jwt) throw new Error("Failed to generate JWT");

        // Send session token to backend to store in HTTP-only cookie
        await fetch("/api/auth/store-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionToken: jwt.jwt,
          }),
          credentials: "include", // Ensures cookies are sent
        });

        // Redirect to dashboard after login
        router.push("/dashboard");
      } catch (error) {
        console.error("Error fetching session:", error);
        router.push("/auth/get-started");
      }
    }

    fetchSession();
  }, [router]);

  return <p>Logging in...</p>;
}
