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
import { useDeleteHod, useHod } from "@/hooks/hod";
import { Branch, Hod } from "@/types/index.d";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import HodDetails from "./details";
import { useGetBranchOrgById } from "@/hooks/branch";

const AddHodModal = dynamic(() => import("./add-user"), {
  loading: () => <span></span>,
  ssr: false,
});

const EditHodModal = dynamic(() => import("./edit-user"), {
  loading: () => <span></span>,
  ssr: false,
});

export type Filter = "ACTIVE" | "INACTIVE" | "all";

const HodTable = ({ orgId }: { orgId: number }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedHod, setSelectedHod] = useState<Hod | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { mutate: deleteHodMutation } = useDeleteHod();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const { data: branch } = useGetBranchOrgById(orgId);

  const {
    data: hodsResponse,
    isLoading,
    refetch: refetchHods,
  } = useHod(currentPage, pageSize, orgId);

  // Filter
  const filteredHods = useMemo(() => {
    if (!hodsResponse?.data) return [];

    return hodsResponse.data.filter((hod: Hod) => {
      const matchesSearch = Object.values(hod)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "ACTIVE" && hod.isActive === "ACTIVE") ||
        (filter === "INACTIVE" && hod.isActive === "INACTIVE");

      const matchesBranch = filterBranch == "all" || Number(filterBranch) == hod.branch.id;

      return matchesSearch && matchesFilter && matchesBranch;
    });
  }, [hodsResponse?.data, searchTerm, filter, filterBranch]);

  const handleViewDetails = (hod: Hod) => {
    setSelectedHod(hod as Hod);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (hod: Hod) => {
    setSelectedHod(hod as Hod);
    setIsEditModalOpen(true);
  };

  const handleDelete = (hodId: number) => {
    if (window.confirm("Are you sure you want to delete this hod?")) {
      deleteHodMutation(hodId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchHods();
            toast.success({ message: "Hod deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedHod(null);
  };

  const handleSuccess = () => {
    refetchHods();
    handleModalClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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
          Add Hod
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={filteredHods}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={hodsResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {isAddModalOpen && (
        <AddHodModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          orgId={orgId}
        />
      )}
      {isEditModalOpen && (
        <EditHodModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedHod={selectedHod}
          branchId={orgId}
        />
      )}
      {isDetailsModalOpen && selectedHod && (
        <HodDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          hod={selectedHod as Hod}
        />
      )}
    </div>
  );
};

export default HodTable;
