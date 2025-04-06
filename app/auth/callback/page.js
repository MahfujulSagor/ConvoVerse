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

        const token = session.$id;

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

        // Store user data in database
        const userResponse = await fetch("/api/auth/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: session.userId,
          }),
        });

        if (!userResponse.ok) {
          throw new Error(`Server Error: ${userResponse.statusText}`);
        }

        // Redirect to dashboard after login
        router.push("/dashboard");

        toast.success("Logged in successfully!");
      } catch (error) {
        console.error("Error fetching session:", error);
        router.push("/auth/get-started");
        localStorage.removeItem("auth_token");
        toast.error("An error occurred while logging in. Please try again.");
      }
    }

    fetchSession();
  }, [router]);

  return <Loader />;
}
