"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { useAppwrite } from "@/context/appwrite-context";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeOAuth = async () => {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");

      if (!userId || !secret) {
        console.error("Missing OAuth parameters");
        router.replace("/auth/get-started");
        return;
      }

      try {
        let session;

        try {
          // Attempt to get the current session
          session = await account.getSession("current");
        } catch (err) {
          // If no session exists, we'll catch the error and create a new session
          console.log("No session found, creating a new session...");
        }

        if (!session) {
          //* Create a new session using the userId and secret
          await account.createSession(userId, secret);
          session = await account.getSession("current");
        }
        const token = session.$id;
        const sessionUserId = session.userId;

        if (!token || !sessionUserId) {
          throw new Error("No session found after creating a new one");
        }

        //* Send token to backend to store in HTTP-only cookie
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

        //* Check if user data exists and create if not
        await checkUserData(sessionUserId);

        //* Redirect to dashboard after login
        router.replace("/dashboard");

        toast.success("Logged in successfully!");
      } catch (error) {
        console.error("Error fetching session:", error);
        toast.error("An error occurred while logging in. Please try again.");
      }
    };

    //? Function to check user data and create if not exists
    const checkUserData = async (userId) => {
      try {
        const userResponse = await fetch("/api/auth/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to create user: ${userResponse.statusText}`);
        }
      } catch (error) {
        console.error("Error creating user data:", error);
      }
    };

    completeOAuth();
  }, [router, searchParams]);

  return <Loader />;
}
