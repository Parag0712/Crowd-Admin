"use client";

import Loader from "@/components/comman/Loader";
import { useOrganizationContext } from "@/contexts/organizationContext";
import { useGetOrganization } from "@/hooks/organization";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  params,
  children,
}: Readonly<{
  params: { orgId?: string }; // Made `id` optional
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const id = Number(params.orgId);
  const { organization, setOrganization } = useOrganizationContext();
  const { data, isLoading, isError, refetch } = useGetOrganization(id);

  // Redirect if university data is not found or there's an error
  useEffect(() => {
    if (!isLoading && !data?.data) {
      router.push("/dashboard");
    }
  }, [data, isLoading, isError, router]);

  // Set the university data in the context
  useEffect(() => {
    if (data?.data) {
      setOrganization(data.data);
    }
  }, [data?.data, setOrganization]);

  useEffect(() => {
    refetch();
  }, [organization, refetch]);

  // Show a loading state while fetching data
  if (isLoading) {
    return <Loader />;
  }

  return <>{children}</>;
}
