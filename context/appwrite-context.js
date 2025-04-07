"use client";
import { account, avatars } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";
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
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);

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
    setSessionLoading(true);
    //* Timeout for the session to be created
    setTimeout(async () => {
      const storedAvatar = localStorage.getItem("avatarUrl");

      try {
        const sessionData = await account.get();

        if (!sessionData) {
          setSession(null);
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
      }finally {
        setSessionLoading(false);
      }
    }, 500);
  };

  //* Sign out
  const signOut = async () => {
    try {
      await account.deleteSession("current");

      localStorage.removeItem("avatarUrl");

      await fetch("/api/auth/sign-out", {
        method: "POST",
        credentials: "include",
      });

      setSession(null);

      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <AppwriteContext.Provider value={{ signIn, session, signOut, sessionLoading }}>
      {children}
    </AppwriteContext.Provider>
  );
};
