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
import { useDeleteFaculty, useFaculty } from "@/hooks/faculty";
import { Branch, Faculty } from "@/types/index.d";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import FacultyDetails from "./details";
import { useGetBranchOrgById } from "@/hooks/branch";

const AddFacultyModal = dynamic(() => import("./add-user"), {
  loading: () => <span></span>,
  ssr: false,
});

const EditFacultyModal = dynamic(() => import("./edit-user"), {
  loading: () => <span></span>,
  ssr: false,
});

export type Filter = "ACTIVE" | "INACTIVE" | "all";

const FacultyTable = ({ orgId }: { orgId: number }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { mutate: deleteFacultyMutation } = useDeleteFaculty();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const { data: branch } = useGetBranchOrgById(orgId);

  const {
    data: facultysResponse,
    isLoading,
    refetch: refetchFacultys,
  } = useFaculty(currentPage, pageSize, orgId);

  // Filter
  const filteredFacultys = useMemo(() => {
    if (!facultysResponse?.data) return [];

    return facultysResponse.data.filter((faculty: Faculty) => {
      const matchesSearch = Object.values(faculty)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "ACTIVE" && faculty.isActive === "ACTIVE") ||
        (filter === "INACTIVE" && faculty.isActive === "INACTIVE");
      const matchesBranch =
        filterBranch == "all" || Number(filterBranch) == faculty.branch.id;
      return matchesSearch && matchesFilter && matchesBranch;
    });
  }, [facultysResponse?.data, searchTerm, filter, filterBranch]);

  const handleViewDetails = (faculty: Faculty) => {
    setSelectedFaculty(faculty as Faculty);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (faculty: Faculty) => {
    setSelectedFaculty(faculty as Faculty);
    setIsEditModalOpen(true);
  };

  const handleDelete = (facultyId: number) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      deleteFacultyMutation(facultyId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchFacultys();
            toast.success({ message: "faculty deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedFaculty(null);
  };

  const handleSuccess = () => {
    refetchFacultys();
    handleModalClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Faculty Management
        </h2>
        <p className="text-muted-foreground">
          View and manage all faculty in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search faculty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-sm py-2 px-4 rounded-lg focus:ring-primary focus:border-primary"
          />
          <Select
            value={filter as string}
            onValueChange={(value) => setFilter(value as Filter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterBranch!}
            onValueChange={(value) => setFilterBranch(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {branch?.data?.map((branch: Branch) => (
                <SelectItem
                  key={branch.id}
                  value={branch.id.toString()}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Faculty
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={filteredFacultys}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={facultysResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {isAddModalOpen && (
        <AddFacultyModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          orgId={orgId}
        />
      )}
      {isEditModalOpen && (
        <EditFacultyModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedFaculty={selectedFaculty}
          branchId={orgId}
        />
      )}
      {isDetailsModalOpen && selectedFaculty && (
        <FacultyDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          faculty={selectedFaculty as Faculty}
        />
      )}
    </div>
  );
};

export default FacultyTable;
