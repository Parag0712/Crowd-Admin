import React from "react";
import Table from "./_components/user-table";
import { notFound } from "next/navigation";

const BranchPage = ({ params }: { params: { orgId: string } }) => {
  if (isNaN(Number(params.orgId))) return notFound();

  const id = Number(params.orgId);

  return (
    <div className="p-8">
      <Table orgId={id} />
    </div>
  );
};

export default BranchPage;
