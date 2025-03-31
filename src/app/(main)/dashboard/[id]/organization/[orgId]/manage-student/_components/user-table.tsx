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
import { useDeleteStudent, useStudent } from "@/hooks/student";
import { Branch, Student } from "@/types/index.d";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import StudentDetails from "./details";
import { useGetBranchOrgById } from "@/hooks/branch";

const AddStudentModal = dynamic(() => import("./add-user"), {
  loading: () => <span></span>,
  ssr: false,
});

const EditStudentModal = dynamic(() => import("./edit-user"), {
  loading: () => <span></span>,
  ssr: false,
});

export type Filter = "ACTIVE" | "INACTIVE" | "all";

const FacultyTable = ({ orgId }: { orgId: number }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { mutate: deleteStudentMutation } = useDeleteStudent();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const { data: branch } = useGetBranchOrgById(orgId);

  const {
    data: studentResponse,
    isLoading,
    refetch: refetchStudents,
  } = useStudent(currentPage, pageSize, orgId);

  // Filter
  const filteredStudents = useMemo(() => {
    if (!studentResponse?.data) return [];

    return studentResponse.data.filter((student: Student) => {
      const matchesSearch = Object.values(student)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "ACTIVE" && student.isActive === "ACTIVE") ||
        (filter === "INACTIVE" && student.isActive === "INACTIVE");
      const matchesBranch = filterBranch == "all" || Number(filterBranch) == student.branch.id;
      return matchesSearch && matchesFilter && matchesBranch;
    });
  }, [studentResponse?.data, searchTerm, filter]);

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student as Student);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student as Student);
    setIsEditModalOpen(true);
  };

  const handleDelete = (studentId: number) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      deleteStudentMutation(studentId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchStudents();
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
    setSelectedStudent(null);
  };

  const handleSuccess = () => {
    refetchStudents();
    handleModalClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Student Management</h2>
        <p className="text-muted-foreground">
          View and manage all student in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search student..."
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
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={filteredStudents}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={studentResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {isAddModalOpen && (
        <AddStudentModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          orgId={orgId}
        />
      )}
      {isEditModalOpen && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedStudent={selectedStudent}
          branchId={orgId}
        />
      )}
      {isDetailsModalOpen && selectedStudent && (
        <StudentDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          student={selectedStudent as Student}
        />
      )}
    </div>
  );
};

export default FacultyTable;
