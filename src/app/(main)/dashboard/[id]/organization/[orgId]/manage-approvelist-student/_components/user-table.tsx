"use client";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useApproveStudent, useGetAllStudentApproveList } from "@/hooks/student";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import StudentDetails from "./details";

import { useCustomToast } from "@/components/providers/toaster-provider";
import { ApprovalListType, Approve_Status, Branch } from "@/types/index.d";
import { useGetBranchOrgById } from "@/hooks/branch";


export type Filter = "APPROVED" | "PENDING" | "REJECTED" | "all";

const FacultyTable = ({ orgId }: { orgId: number }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<ApprovalListType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const { data: branch } = useGetBranchOrgById(orgId);

  const pageSize = 10;
  const toast = useCustomToast();
  const {
    data: studentResponse,
    isLoading
  } = useGetAllStudentApproveList(orgId);
  const { mutate: approveStudent } = useApproveStudent();

  // Filter
  const filteredFacultys = useMemo(() => {
    if (!studentResponse?.data) return [];

    return studentResponse.data.filter((student: ApprovalListType) => {
      const matchesSearch = Object.values(student)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || filter === student.status;
      const matchesBranch = filterBranch == "all" || Number(filterBranch) == student.branch.id;
      return matchesSearch && matchesFilter && matchesBranch;
    });
  }, [studentResponse?.data, searchTerm, filter, filterBranch]);

  const handleViewDetails = (student: ApprovalListType) => {
    setSelectedFaculty(student as ApprovalListType);
    setIsDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedFaculty(null);
  };


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleToggleStatus = (id: number, newStatus: Approve_Status) => {
    approveStudent(
      { studentId: id, status: newStatus },
      {
        onSuccess: (response) => {
          if (response.success) {
            toast.success({ message: "Student Approved Status Updated Successfully" });
          }
        },
      }
    )
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Faculty Management</h2>
        <p className="text-muted-foreground">
          View and manage all students in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search students..."
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
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
              {
                branch?.data?.map((branch: Branch) => (
                  <SelectItem
                    key={branch.id}
                    value={branch.id.toString()}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {branch.name}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onViewDetails: handleViewDetails,
            onToggleStatus: handleToggleStatus,
          })}
          data={filteredFacultys}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={studentResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={() => { }}
          onDelete={() => { }}
        />
      </div>
      {isDetailsModalOpen && selectedFaculty && (
        <StudentDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          student={selectedFaculty as ApprovalListType}
        />
      )}
    </div>
  );
};

export default FacultyTable;
