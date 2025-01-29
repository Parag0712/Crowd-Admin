"use client";

import { University } from "@/types";
import { createContext, type ReactNode, useState, useContext } from "react";

interface UniversityContextType {
  university: University | null; // Allow `null` for initial state
  setUniversity: React.Dispatch<React.SetStateAction<University | null>>;
}

const UniversityContext = createContext<UniversityContextType | undefined>(
  undefined,
);

export const UniversityProvider = ({ children }: { children: ReactNode }) => {
  const [university, setUniversity] = useState<University | null>(null);

  return (
    <UniversityContext.Provider value={{ university, setUniversity }}>
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversityContext = () => {
  const context = useContext(UniversityContext);
  if (context === undefined) {
    throw new Error(
      "useUniversityContext must be used within a UniversityProvider",
    );
  }
  return context;
};
