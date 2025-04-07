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
  const [currentAI, setCurrentAI] = useState(() => {
    if (typeof window === "undefined") return AI[0]; //* SSR Safety
    try {
      const storedAI = localStorage.getItem("currentAI");
      return storedAI ? JSON.parse(storedAI) : AI[0];
    } catch (error) {
      console.error("Error getting AI from localStorage", error);
      return AI[0];
    }
  });
  const [history, setHistory] = useState([]);

  //? Store in localStorage when AI changes
  useEffect(() => {
    if (currentAI) {
      try {
        localStorage.setItem("currentAI", JSON.stringify(currentAI));
      } catch (error) {
        console.error("Error setting AI in localStorage", error);
      }
    }
  }, [currentAI]);

  //? Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!session?.$id) {
        return;
      }
      try {
        const response = await fetch(`/api/chat/history?userId=${session.$id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch chat history");
        }
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchHistory();
  }, [session]);

  // * Handle new chat creation
  const handleNewChat = async ({ userId }) => {
    if (!userId) {
      console.error("No user ID provided");
      return;
    }

    try {
      const response = await fetch("/api/chat/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create new chat");
      }

      const newHistoryId = await response.json();
      router.push(`/dashboard/chat/${newHistoryId}`);
    } catch (error) {
      console.error("Error creating chat history:", error);
      toast.error("Failed to create new chat");
    }
  };

  return (
    <AIContext.Provider
      value={{ currentAI, setCurrentAI, AI, handleNewChat, history }}
    >
      {children}
    </AIContext.Provider>
  );
};
