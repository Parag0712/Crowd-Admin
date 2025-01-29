import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Guard } from "@/types";

interface ColumnsProps {
  onEdit: (data: Guard) => void;
  onDelete: (id: number) => void;
  onViewDetails: (data: Guard) => void;
}

export const columns = ({
  onEdit,
  onDelete,
  onViewDetails,
}: ColumnsProps): ColumnDef<Guard>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "employeeId",
    header: "Employee Id",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as "ACTIVE" | "INACTIVE";
      let badgeColor = "";
      switch (isActive) {
        case "ACTIVE":
          badgeColor = "bg-purple-600";
          break;
        case "INACTIVE":
          badgeColor = "bg-red-600";
          break;
      }
      return (
        <Badge
          variant="outline"
          className={`px-2 py-1 text-xs font-bold tracking-wide ${badgeColor} text-white rounded-full shadow-sm`}
        >
          {isActive === "ACTIVE" ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return <span>{format(new Date(createdAt), "dd MMM yyyy")}</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(row.original)}>
              <Eye className="h-4 w-4 mr-2 text-green-500" />
              Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4 mr-2 text-blue-500" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(Number(id))}
              className="text-red-600"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
