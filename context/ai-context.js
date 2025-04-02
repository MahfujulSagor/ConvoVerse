"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import OpenAI from "@/public/openai.svg";
import Deepseek from "@/public/deepseek.svg";
import Gemini from "@/public/gemini.svg";

const AIContext = createContext(null);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

const AI = [
  // {
  //   name: "OpenAI",
  //   logo: OpenAI,
  //   organization: 'openai',
  // },
  {
    name: "Deepseek",
    logo: Deepseek,
    organization: 'deepseek',
  },
  {
    name: "Gemini",
    logo: Gemini,
    organization: 'gemini',
  },
  // {
  //   name: "Grok",
  //   logo: Grok,
  //   organization: 'grok',
  // },
];

export const AIProvider = ({ children }) => {
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

  // Store in localStorage when AI changes
  useEffect(() => {
    if (currentAI) {
      try {
        localStorage.setItem("currentAI", JSON.stringify(currentAI));
      } catch (error) {
        console.error("Error setting AI in localStorage", error);
      }
    }
  }, [currentAI]);

  return (
    <AIContext.Provider value={{ currentAI, setCurrentAI, AI }}>
      {children}
    </AIContext.Provider>
  );
};
