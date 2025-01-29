
import React from "react";
import UserTable from "./_components/user-table";
import { notFound } from "next/navigation";

const UsersPage = ({ params }: { params: { id: string } }) => {
  if(isNaN(Number(params.id))) return notFound();

  const id = Number(params.id);
  
  return (
    <div className="p-8">
      <UserTable universityId={id} />
    </div>
  );
};

export default UsersPage;
