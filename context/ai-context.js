"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Deepseek from "@/public/deepseek.svg";
import Gemini from "@/public/gemini.svg";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppwrite } from "./appwrite-context";

const AIContext = createContext(null);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

const AI = [
  {
    name: "Deepseek",
    logo: Deepseek,
    organization: "deepseek",
  },
  {
    name: "Gemini",
    logo: Gemini,
    organization: "gemini",
  },
];

export const AIProvider = ({ children }) => {
  const router = useRouter();
  const { session } = useAppwrite();
  const [isClient, setIsClient] = useState(false);
  // const [currentAI, setCurrentAI] = useState(() => {
  //   if (typeof window === "undefined") return AI[0]; //* SSR Safety
  //   try {
  //     const storedAI = localStorage.getItem("currentAI");
  //     return storedAI ? JSON.parse(storedAI) : AI[0];
  //   } catch (error) {
  //     console.error("Error getting AI from localStorage", error);
  //     return AI[0];
  //   }
  // });
  const [currentAI, setCurrentAI] = useState(AI[0]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setIsClient(true);

    if (typeof window !== "undefined") {
      try {
        const storedAI = localStorage.getItem("currentAI");
        setCurrentAI(storedAI ? JSON.parse(storedAI) : AI[0]);

        const storedHistory = localStorage.getItem("history");
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
  }, []);

  //? Store in localStorage when AI changes
  useEffect(() => {
    if (isClient && currentAI) {
      try {
        localStorage.setItem("currentAI", JSON.stringify(currentAI));
      } catch (error) {
        console.error("Error setting AI in localStorage", error);
      }
    }
  }, [currentAI, isClient]);

  //? Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.$id) {
        return;
      }
      try {
        const response = await fetch(`/api/chat/history?userId=${session.$id}`);
        if (!response.ok) {
          console.error("Error fetching chat history:", response.statusText);
          toast.error("Failed to fetch chat history");
          return;
        }
        const data = await response.json();
        setHistory(data);
        //* Store in localStorage
        if (isClient) {
          localStorage.setItem("history", JSON.stringify(data));
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    if (!history.length && session?.$id) {
      fetchHistory();
    }
  }, [session, history.length, isClient]);

  // * Handle new chat creation
  const handleNewChat = async () => {
    const userId = session?.$id;

    if (!userId) {
      console.error("No user ID provided");
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); //? 10s timeout

    try {
      //? Query to get the count of histories for the user
      const historyCountRes = await fetch(
        `/api/chat/history-limit?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (historyCountRes.status === 403) {
        toast.error(
          "You’ve reached your limit of chats. Please delete old ones to start a new one."
        );
        return;
      }

      const response = await fetch("/api/chat/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error("Error creating new chat history:", response.statusText);
        toast.error("Failed to create new chat");
        return;
      }

      const newHistory = await response.json();
      const newHistoryId = newHistory?.$id;
      router.push(`/dashboard/chat/${newHistoryId}`);

      setHistory((prevHistory) => {
        const updatedHistory = [newHistory, ...prevHistory];
        if (isClient) {
          localStorage.setItem("history", JSON.stringify(updatedHistory));
        }
        return updatedHistory;
      });
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("🔌 New chat creation was aborted");
        toast.error("Chat creation timed out");
      } else {
        console.error("Error creating chat history:", error);
        toast.error("Failed to create new chat");
      }
      router.push("/dashboard");
    } finally {
      clearTimeout(timeoutId); //? Clear the timeout
    }
  };

  // * Handle chat history deletion
  const handleChatHistoryDelete = async (historyId) => {
    if (!historyId || !session?.$id) {
      console.error("Missing historyId or user session");
      return;
    }

    try {
      const response = await fetch("/api/chat/history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          historyId,
          userId: session.$id,
        }),
      });

      if (!response.ok) {
        console.error("Error deleting chat history:", response.statusText);
        toast.error("Failed to delete chat history");
        return;
      }

      const updatedHistory = history.filter((item) => item.$id !== historyId);
      setHistory(updatedHistory);
      if (isClient) {
        localStorage.setItem("history", JSON.stringify(updatedHistory));
      }
      toast.success("Chat history deleted successfully");
    } catch (error) {
      console.error("Error deleting chat history:", error);
      toast.error("Failed to delete chat history");
    }
  };

  return (
    <AIContext.Provider
      value={{
        currentAI,
        setCurrentAI,
        AI,
        handleNewChat,
        history,
        handleChatHistoryDelete,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
