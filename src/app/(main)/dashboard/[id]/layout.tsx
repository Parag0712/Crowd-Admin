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
  params: { id: string };
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const id = Number(params.id);
  const { university, setUniversity } = useUniversityContext();

  // Validate the id parameter
  useEffect(() => {
    if (isNaN(id)) {
      router.push("/dashboard");
    }
  }, [id, router]);

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

  // Refetch data when the university context changes
  useEffect(() => {
    refetch();
  }, [university, refetch]);

  // Clear the university context when the component unmounts
  useEffect(() => {
    return () => {
      setUniversity(null);
    };
  }, [setUniversity]);

  // Show a loading state while fetching data
  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
