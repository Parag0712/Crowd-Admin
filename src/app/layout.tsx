import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/auth-provider";
import QueryProvider from "@/components/providers/query-provider";
import React from "react";
import Loader from "@/components/comman/Loader";
import { Toaster } from "@/components/ui/toaster";
import { UniversityProvider } from "@/contexts/universityContext";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "GateTrack",
  description: "GateTrack admin panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <React.Suspense fallback={<Loader />}>
              <UniversityProvider>
                {children}
                <Toaster />
              </UniversityProvider>
            </React.Suspense>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
