"use client";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useUniversity } from "@/hooks/university";
import { useDeleteUser } from "@/hooks/users";
import { University } from "@/types";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import UniversityDetails from "./details";

const AddUniversityModal = dynamic(() => import("./add-university"), {
  loading: () => <span></span>,
  ssr: false,
});

const EditUniversityModal = dynamic(() => import("./edit-university"), {
  loading: () => <span></span>,
  ssr: false,
});

const UserTable = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { mutate: deleteUserMutation } = useDeleteUser();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const {
    data: universitiesResponse,
    isLoading,
    refetch: refetchUniversities,
  } = useUniversity(currentPage, pageSize);


  const handleViewDetails = (user: University) => {
    setSelectedUniversity(user);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (user: University) => {
    setSelectedUniversity(user);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation(userId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchUniversities();
            toast.success({ message: "University deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedUniversity(null);
  };

  const handleSuccess = () => {
    refetchUniversities();
    handleModalClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <p className="text-muted-foreground">
          View and manage all users in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
         
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={universitiesResponse?.data ?? []}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={universitiesResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {isAddModalOpen && (
        <AddUniversityModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
      {isEditModalOpen && (
        <EditUniversityModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedUniversity={selectedUniversity}
        />
      )}
      {isDetailsModalOpen && selectedUniversity && (
        <UniversityDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          university={selectedUniversity}
        />
      )}
    </div>
  );
};

export default UserTable;
