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
    if (!session) {
      getSession();
    }
  }, [session]);

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
      // Check if avatar URL is already stored in localStorage
      const storedAvatar = localStorage.getItem("avatarUrl");
      if (storedAvatar) {
        setSession((prevSession) => {
          return { ...prevSession, avatar: storedAvatar }; // Set from localStorage
        });
        return; // Exit early if avatar is found in localStorage
      }

      // Fetch the session data
      const sessionData = await account.get();

      // Generate avatar if not found in localStorage
      const avatarUrl = avatars.getInitials(sessionData.name);

      // Store avatar URL in localStorage
      localStorage.setItem("avatarUrl", avatarUrl);

      // Set session state with avatar URL
      setSession((prevSession) => {
        return { ...sessionData, avatar: avatarUrl };
      });
    } catch (error) {
      console.error("Error fetching session:", error);
    }
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
    <AppwriteContext.Provider value={{ signIn, session, signOut }}>
      {children}
    </AppwriteContext.Provider>
  );
};
