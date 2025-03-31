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
import { useDeleteGate, useGate } from "@/hooks/gate";
import { Gate } from "@/types";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import GateDetails from "./details";

const AddGateModal = dynamic(() => import("./add-user"), {
  loading: () => <span></span>,
  ssr: false,
});

const EditGateModal = dynamic(() => import("./edit-user"), {
  loading: () => <span></span>,
  ssr: false,
});

export type Filter = "ACTIVE" | "INACTIVE" | "all";

const GateTable = ({ universityId }: { universityId: number }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGate, setSelectedGate] = useState<Gate | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const { mutate: deleteGateMutation } = useDeleteGate();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const {
    data: gatesResponse,
    isLoading,
    refetch: refetchGates,
  } = useGate(currentPage, pageSize, universityId);

  // Filter gates based on the filter (ACTIVE, INACTIVE, or all) and search term
  const filteredGates = useMemo(() => {
    if (!gatesResponse?.data) return [];

    return gatesResponse.data.filter((gate: Gate) => {
      const matchesSearch = Object.values(gate)
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Filter gates based on the 'status' or 'filter' selected
      const matchesFilter =
        filter === "all" ||
        (filter === "ACTIVE" && gate.isActive === "ACTIVE") ||
        (filter === "INACTIVE" && gate.isActive === "INACTIVE");

      return matchesSearch && matchesFilter;
    });
  }, [gatesResponse?.data, searchTerm, filter]);

  const handleViewDetails = (gate: Gate) => {
    setSelectedGate(gate as Gate);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (gate: Gate) => {
    setSelectedGate(gate as Gate);
    setIsEditModalOpen(true);
  };

  const handleDelete = (gateId: number) => {
    if (window.confirm("Are you sure you want to delete this gate?")) {
      deleteGateMutation(gateId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchGates();
            toast.success({ message: "Gate deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedGate(null);
  };

  const handleSuccess = () => {
    refetchGates();
    handleModalClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gate Management</h2>
        <p className="text-muted-foreground">
          View and manage all gates in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search gates..."
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
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Gate
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={filteredGates}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={gatesResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {isAddModalOpen && (
        <AddGateModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          universityId={universityId}
        />
      )}
      {isEditModalOpen && (
        <EditGateModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedGate={selectedGate}
          universityId={universityId}
        />
      )}
      {isDetailsModalOpen && selectedGate && (
        <GateDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          gate={selectedGate as Gate}
        />
      )}
    </div>
  );
};

export default GateTable;
