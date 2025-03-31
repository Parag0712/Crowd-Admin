"use client";

import Loader from "@/components/comman/Loader";
import { useUniversityContext } from "@/contexts/universityContext";
import { useGetUniversity } from "@/hooks/university";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  params,
  children,
}: Readonly<{
  params: { id?: string }; // Made `id` optional
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const id = params.id ? Number(params.id) : NaN;
  const { university, setUniversity } = useUniversityContext();
  const { data, isLoading, isError, refetch } = useGetUniversity(id);

  // Redirect if university data is not found or there's an error
  useEffect(() => {
    if (!isLoading && !data?.data) {
      router.push("/dashboard");
    }
  }, [data, isLoading, isError, router]);

  // Set the university data in the context
  useEffect(() => {
    if (data?.data) {
      setUniversity(data.data);
    }
  }, [data?.data, setUniversity]);

  useEffect(() => {
    refetch();
  }, [university, refetch]);

  // Show a loading state while fetching data
  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
