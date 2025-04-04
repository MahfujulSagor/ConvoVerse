"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";
import Loader from "@/components/Loader";

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    async function fetchSession() {
      try {
        const session = await account.getSession("current");

        const token = session.providerAccessToken;

        if (!token) {
          throw new Error("No token found in session");
        }
        // Send token to backend to store in HTTP-only cookie
        const response = await fetch("/api/auth/store-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionToken: token,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Server Error: ${response.statusText}`);
        }

        // Store the token in local storage
        localStorage.setItem("auth_token", token);

        // Redirect to dashboard after login
        router.push("/dashboard");
        toast.success("Logged in successfully!");
      } catch (error) {
        console.error("Error fetching session:", error);
        router.push("/auth/get-started");
        toast.error("An error occurred while logging in. Please try again.");
      }
    }

    fetchSession();
  }, [router]);

  return <Loader />;
}
