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
import { useGuard } from "@/hooks/guard";
import { useDeleteUser } from "@/hooks/users";
import { Guard } from "@/types";
import { UserRole } from "@/types/next-auth";
import { PlusCircle } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
// import AddGuardModal from "./add-user";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import UserDetails from "./details";

const AddGuardModal = dynamic(() => import("./add-user"), {
  loading: () => <span></span>,
  ssr: false,
});

const EditGuardModal = dynamic(() => import("./edit-user"), {
  loading: () => <span></span>,
  ssr: false,
});

export type RoleFilter = UserRole | "all";

const GuardTable = ({ universityId }: { universityId: number }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const { mutate: deleteUserMutation } = useDeleteUser();
  const toast = useCustomToast();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  const {
    data: guardsResponse,
    isLoading,
    refetch: refetchGuards,
  } = useGuard(currentPage, pageSize, universityId);

  const handleViewDetails = (guard: Guard) => {
    setSelectedGuard(guard as Guard);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (guard: Guard) => {
    setSelectedGuard(guard as Guard);
    setIsEditModalOpen(true);
  };

  const handleDelete = (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation(userId, {
        onSuccess: (response) => {
          if (response.success) {
            refetchGuards();
            toast.success({ message: "User deleted successfully" });
          }
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedGuard(null);
  };

  const handleSuccess = () => {
    refetchGuards();
    handleModalClose();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // const filteredUsers = React.useMemo(() => {
  //   if (!guardsResponse?.data || !session?.user?.id) return [];

  //   return Array.isArray(guardsResponse.data)
  //     ? guardsResponse.data
  //         .filter((guard: Guard) => guard.id !== session.user.id)
  //         .filter((guard: Guard) => {
  //           const matchesSearch = Object.values(guard)
  //             .join(" ")
  //             .toLowerCase()
  //             .includes(searchTerm.toLowerCase());
  //           const matchesRole =
  //               roleFilter === "all" || guard.role === roleFilter;
  //           return matchesSearch && matchesRole;
  //         })
  //     : [];
  // }, [guardsResponse?.data, session?.user?.id, searchTerm, roleFilter]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Guard Management</h2>
        <p className="text-muted-foreground">
          View and manage all guards in the system
        </p>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search guards..."
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
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Guard
        </Button>
      </div>
      <div className="overflow-x-auto">
        <DataTable
          columns={columns({
            onEdit: handleEdit,
            onDelete: handleDelete,
            onViewDetails: handleViewDetails,
          })}
          data={guardsResponse?.data ?? []}
          loading={isLoading}
          pageSize={pageSize}
          currentPage={currentPage}
          totalItems={guardsResponse?.data?.length ?? 0}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {isAddModalOpen && (
        <AddGuardModal
          isOpen={isAddModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          universityId={universityId}
        />
      )}
      {isEditModalOpen && (
        <EditGuardModal
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
          selectedGuard={selectedGuard}
          universityId={universityId}
        />
      )}
      {isDetailsModalOpen && selectedGuard && (
        <UserDetails
          isOpen={isDetailsModalOpen}
          onClose={handleModalClose}
          guard={selectedGuard as Guard}
        />
      )}
    </div>
  );
};

export default GuardTable;
