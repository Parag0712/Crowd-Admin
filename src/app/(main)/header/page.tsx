"use client";
import React from "react";
import Profile from "./_components/profile";
import { useUniversityContext } from "@/contexts/universityContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { university } = useUniversityContext();
  return (
    <div className="py-4 px-10 shadow-sm flex justify-end items-center gap-4 top-0 bg-white z-50">
      {university && (
        <Button variant="outline" className="bg-primary/10">
          {university?.name}
        </Button>
      )}
      <Profile />
    </div>
  );
};

export default Header;
