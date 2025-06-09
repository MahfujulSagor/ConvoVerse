"use client";
import { account, avatars } from "@/lib/appwrite";
import { OAuthProvider } from "appwrite";
import { useRouter } from "next/navigation";
import { createContext, useContext } from "react";
import useSWR from "swr";

const AppwriteContext = createContext();

export const useAppwrite = () => {
  const context = useContext(AppwriteContext);
  if (!context) {
    throw new Error("useAppwrite must be used within an AppwriteProvider");
  }
  return context;
};

//* 🔁 SWR fetcher
const fetchSession = async () => {
  const sessionData = await account.get();

  if (!sessionData) return null;

  const res = await fetch(`/api/auth/user?userId=${sessionData.$id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to fetch user data");

  const userFreePrompts = await res.json();

  const storedAvatar = localStorage.getItem("avatarUrl");

  if (storedAvatar) {
    return {
      ...sessionData,
      avatar: storedAvatar,
      free_prompts: userFreePrompts,
    };
  }

  const avatarUrl = avatars.getInitials(sessionData.name || "User");
  localStorage.setItem("avatarUrl", avatarUrl);

  return {
    ...sessionData,
    avatar: avatarUrl,
    free_prompts: userFreePrompts,
  };
};

export const AppwriteProvider = ({ children }) => {
  const router = useRouter();

  const {
    data: session,
    isLoading: sessionLoading,
    mutate: refreshSession,
    error,
  } = useSWR("userSession", fetchSession, {
    dedupingInterval: 60000, //? 1 minute – prevent repeated fetches within that window
    revalidateOnFocus: false, //? disable refresh on tab switch
    revalidateOnReconnect: false, //? optional: disable on reconnect
  });

  //* Sign in with Google
  const signInWithGoogle = async () => {
    try {
      account.createOAuth2Token(
        OAuthProvider.Google,
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get-started`
      );
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  //* Sign in with Github
  const signInWithGithub = async () => {
    try {
      account.createOAuth2Token(
        OAuthProvider.Github,
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/get-started`
      );
    } catch (error) {
      console.error("Error signing in:", error);
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

      localStorage.clear();

      refreshSession();

      router.replace("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <AppwriteContext.Provider
      value={{
        signInWithGoogle,
        signInWithGithub,
        session,
        signOut,
        sessionLoading,
        refreshSession,
      }}
    >
      {children}
    </AppwriteContext.Provider>
  );
};
