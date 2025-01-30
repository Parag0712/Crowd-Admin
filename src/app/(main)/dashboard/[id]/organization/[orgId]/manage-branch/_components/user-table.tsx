"use client";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Branch, Organization } from "@/types/index.d";
import { UserRole } from "@/types/next-auth";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import BranchDetails from "./details";
import { useDeleteBranch, useBranch } from "@/hooks/branch";

const AddBranchModal = dynamic(() => import("./add-user"), {
  loading: () => <span></span>,
  ssr: false,
});

const EditBranchModal = dynamic(() => import("./edit-user"), {
  loading: () => <span></span>,
  ssr: false,
});

export type RoleFilter = UserRole | "all";

const BranchTable = ({ orgId }: { orgId: number }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const { mutate: deleteBranchMutation } = useDeleteBranch();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: organizationsResponse,
    isLoading,
    refetch: refetchBranches,
  } = useBranch(currentPage, pageSize, orgId);

  const handleViewDetails = (branch: Branch) => {
    setSelectedBranch(branch as Branch);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (branch: Branch) => {
    setSelectedBranch(branch as Branch);
    setIsEditModalOpen(true);
  };

  const handleDelete = (branchId: number) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
        deleteBranchMutation(branchId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchBranches();
            toast.success({ message: "Organization deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedBranch(null);
  };

  const handleSuccess = () => {
    refetchBranches();
    handleModalClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const filteredOrganizations = React.useMemo(() => {
    if (!organizationsResponse?.data ) return [];

    return Array.isArray(organizationsResponse.data)
      ? organizationsResponse.data
          .filter((organization: Organization) => {
            const matchesSearch = Object.values(organization)
              .join(" ")
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
            return matchesSearch;
          })
      : [];
  }, [organizationsResponse?.data, searchTerm]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Branch Management</h2>
        <p className="text-muted-foreground">
          View and manage all branches in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
          <Select
            value={roleFilter as string}
            onValueChange={(value) => setRoleFilter(value as RoleFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="USER">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={filteredOrganizations}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={organizationsResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {isAddModalOpen && (
        <AddBranchModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          orgId={orgId}
        />
      )}
      {isEditModalOpen && (
        <EditBranchModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedBranch={selectedBranch}
          orgId={orgId}
        />
      )}
      {isDetailsModalOpen && selectedBranch && (
          <BranchDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          branch={selectedBranch as Branch}
        />
      )}
    </div>
  );
};

export default BranchTable;
