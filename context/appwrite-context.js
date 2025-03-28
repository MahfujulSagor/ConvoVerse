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

  useEffect(() => {
    getSession();
  }, []);

  //* Sign in with Google
  const signIn = async () => {
    try {
      account.createOAuth2Session(
        OAuthProvider.Google,
        `http://localhost:3000/auth/callback`
      );
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  //* Get current session
  const getSession = async () => {
    try {
      const sessionData = await account.get();
      const avatarUrl = avatars.getInitials(sessionData.name);
      setSession({ ...sessionData, avatar: avatarUrl });
    } catch (error) {
      console.error("Error fetching session:", error);
    }
  };

  //* Sign out
  const signOut = async () => {
    try {
      await account.deleteSession("current");

      await fetch("/api/auth/logout", {
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
    <AppwriteContext.Provider value={{ signIn, session, signOut }}>
      {children}
    </AppwriteContext.Provider>
  );
};
