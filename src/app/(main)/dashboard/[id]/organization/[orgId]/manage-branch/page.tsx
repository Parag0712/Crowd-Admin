import React from "react";
import Table from "./_components/user-table";
import { notFound } from "next/navigation";

const BranchPage = ({ params }: { params: { id: string } }) => {
  if (isNaN(Number(params.id))) return notFound();

  const id = Number(params.id);

  return (
    <div className="p-8">
      <Table orgId={id} />
    </div>
  );
};

export default BranchPage;