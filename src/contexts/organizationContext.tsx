"use client";

import { Organization,  } from "@/types";
import { createContext, type ReactNode, useState, useContext } from "react";

interface OrganizationContextType {
  organization: Organization | null; // Allow `null` for initial state
  setOrganization: React.Dispatch<React.SetStateAction<Organization | null>>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined,
);

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organization, setOrganization] = useState<Organization | null>(null);

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganizationContext must be used within a UniversityProvider",
    );
  }
  return context;
};
