"use client";

import { Loader2 } from "lucide-react";

export default function Loader() {
  return <div className="flex justify-center items-center h-screen">
    <Loader2 className="animate-spin" size={100} />
  </div>;
}
