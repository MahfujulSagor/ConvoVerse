"use client";
import { account, avatars } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

const AppwriteContext = createContext();

export const useAppwrite = () => {
  const context = useContext(AppwriteContext);
  if (!context) {
    throw new Error("useAppwrite must be used within an AppwriteProvider");
  }
  return context;
};

export const AppwriteProvider = ({ children }) => {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    getSession();
  }, []);

  //* Sign in with Google
  const signIn = async () => {
    try {
      account.createOAuth2Token(
        OAuthProvider.Google,
        `http://localhost:3000/auth/callback`,
        "http://localhost:3000/auth/get-started"
      );
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  //* Get current session
  const getSession = async () => {
    //* Timeout for the session to be created
    const storedAvatar = localStorage.getItem("avatarUrl");

    try {
      const sessionData = await account.get();

      if (!sessionData) {
        setSession(null);
        setSessionLoading(false);
        return;
      }

      if (storedAvatar) {
        setSession(() => ({
          ...sessionData,
          avatar: storedAvatar,
        }));
        return;
      }

      const avatarUrl = avatars.getInitials(sessionData.name || "User");
      localStorage.setItem("avatarUrl", avatarUrl);

      setSession(() => ({
        ...sessionData,
        avatar: avatarUrl,
      }));
    } catch (error) {
      if (error.message.includes("missing scope (account)")) {
        console.warn("Guest user detected.");
      } else {
        console.error("Error fetching session:", error);
      }
      setSession(null);
    } finally {
      setSessionLoading(false);
    }
  };

  //* Sign out
  const signOut = async () => {
    try {
      await account.deleteSession("current");

      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      setSession(null);

      localStorage.removeItem("avatarUrl");
      localStorage.removeItem("history");
      localStorage.removeItem("currentAI");
      localStorage.removeItem("models");

      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <AppwriteContext.Provider
      value={{
        signIn,
        session,
        signOut,
        sessionLoading,
        refreshSession: getSession,
      }}
    >
      {children}
    </AppwriteContext.Provider>
  );
};
