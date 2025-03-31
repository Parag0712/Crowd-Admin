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
import { useApproveHod, useGetAllHodApproveList } from "@/hooks/hod";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import HodDetails from "./details";

import { ApprovalListType, Approve_Status, Branch } from "@/types/index.d";
import { useCustomToast } from "@/components/providers/toaster-provider";
import { useGetBranchOrgById } from "@/hooks/branch";

export type Filter = "APPROVED" | "PENDING" | "REJECTED" | "all";

const HodTable = ({ orgId }: { orgId: number }) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedHod, setSelectedHod] = useState<ApprovalListType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const toast = useCustomToast();
  const { data: branch } = useGetBranchOrgById(orgId);

  const {
    data: hodsResponse,
    isLoading,
  } = useGetAllHodApproveList(orgId);
  const { mutate: approveHod } = useApproveHod();

  // Filter
  const filteredHods = useMemo(() => {
    if (!hodsResponse?.data) return [];

    return hodsResponse.data.filter((hod: ApprovalListType) => {
      const matchesSearch = Object.values(hod)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || filter === hod.status;
      const matchesBranch = filterBranch == "all" || Number(filterBranch) == hod.branch.id;
      return matchesSearch && matchesFilter && matchesBranch;
    });
  }, [hodsResponse?.data, searchTerm, filter, filterBranch]);

  const handleViewDetails = (hod: ApprovalListType) => {
    setSelectedHod(hod as ApprovalListType);
    setIsDetailsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedHod(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleToggleStatus = (id: number, newStatus: Approve_Status) => {
    approveHod(
      { hodId: id, status: newStatus },
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
        <h2 className="text-2xl font-bold tracking-tight">Hod Management</h2>
        <p className="text-muted-foreground">
          View and manage all hods in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search hods..."
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
          data={filteredHods}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={hodsResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={() => { }}
          onDelete={() => { }}
        />
      </div>

      {isDetailsModalOpen && selectedHod && (
        <HodDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          hod={selectedHod as ApprovalListType}
        />
      )}
    </div>
  );
};

export default HodTable;
