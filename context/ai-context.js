"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import Deepseek from "@/public/deepseek.svg";
import Gemini from "@/public/gemini.svg";
import Meta from "@/public/meta.svg";
import Mistral from "@/public/mistral.svg";
import Nvidia from "@/public/nvidia.svg";
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
  {
    name: "Meta",
    logo: Meta,
    organization: "meta",
  },
  {
    name: "Nvidia",
    logo: Nvidia,
    organization: "nvidia",
  },
  {
    name: "Mistral",
    logo: Mistral,
    organization: "mistral",
  },
];

export const AIProvider = ({ children }) => {
  const router = useRouter();
  const { session } = useAppwrite();
  const [isClient, setIsClient] = useState(false);
  const [currentAI, setCurrentAI] = useState(AI[0]);
  const [history, setHistory] = useState([]);
  const [deletedHistory, setDeletedHistory] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!session?.$id) {
      return;
    }
    setIsClient(true);
    const userId = session.$id;

    if (typeof window !== "undefined") {
      try {
        const storedAI = localStorage.getItem("currentAI");
        setCurrentAI(storedAI ? JSON.parse(storedAI) : AI[0]);

        //? Remove legacy history from localStorage
        localStorage.removeItem("history");

        const validKey = `history_${userId}`;

        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("history_") && key !== validKey) {
            localStorage.removeItem(key);
          }
        });
        //? Fetch history from localStorage
        const storedHistory = localStorage.getItem(validKey);
        setHistory(storedHistory ? JSON.parse(storedHistory) : []);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
      }
    }
  }, [session?.$id]);

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
        const response = await fetch(
          `/api/chat/history?userId=${session.$id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          console.warn("Error fetching chat history:", response.statusText);
          return;
        }
        const data = await response.json();
        setHistory(data);
        //* Store in localStorage
        if (isClient) {
          localStorage.setItem(`history_${session.$id}`, JSON.stringify(data));
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
          localStorage.setItem(
            `history_${userId}`,
            JSON.stringify(updatedHistory)
          );
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

    //? Optimistic UI: Immediately remove from UI before server confirms
    const updatedHistory = history.filter((item) => item.$id !== historyId);
    setHistory(updatedHistory);
    if (isClient) {
      localStorage.setItem(
        `history_${session.$id}`,
        JSON.stringify(updatedHistory)
      );
    }
    setDeletedHistory(historyId);

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
        //? Rollback the optimistic delete if needed
        setHistory((prevHistory) => [...updatedHistory, ...prevHistory]);
        return;
      }

      toast.success("Chat history deleted successfully");
    } catch (error) {
      console.error("Error deleting chat history:", error);
      toast.error("Failed to delete chat history");
      //? Rollback the optimistic delete if needed
      setHistory((prevHistory) => [...updatedHistory, ...prevHistory]);
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
        deletedHistory,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
