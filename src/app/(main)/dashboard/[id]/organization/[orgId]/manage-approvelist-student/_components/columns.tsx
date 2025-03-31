import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, MoreHorizontal } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApprovalListType, Approve_Status } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface ColumnsProps {
  onViewDetails: (data: ApprovalListType) => void;
  onToggleStatus: (id: number, newStatus: Approve_Status) => void;
}

export const columns = ({
  onViewDetails,
  onToggleStatus
}: ColumnsProps): ColumnDef<ApprovalListType>[] => [
    {
      accessorKey: "approvedName",
      header: "User Name",
    },
    {
      accessorKey: "approvedEmail",
      header: "User Email",
    },
    {
      accessorKey: "approvedByName",
      header: "Approved By Name",
    },
    {
      accessorKey: "approvedByEmail",
      header: "Approved By Email",
    },
    {
      accessorKey: "Branch",
      header: "Branch",
      cell: ({ row }) => {
        return (
          <Badge
            variant="outline"
            className={`px-2 py-1 text-xs font-bold tracking-wide bg-purple-400 text-white rounded-full shadow-sm`}
          >{
              row.original.branch.name
            }
          </Badge>
        );
      },
    },
    {
      accessorKey: "approverType",
      header: "Approver Type",
      cell: ({ row }) => {
        return (
          <Badge
            variant="outline"
            className={`px-2 py-1 text-xs font-bold tracking-wide bg-purple-400 text-white rounded-full shadow-sm`}
          >{
              row.getValue("approverType")
            }
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Approve_Status;
        let badgeColor = "";
        switch (status) {
          case "APPROVED":
            badgeColor = "bg-green-600";
            break;
          case "PENDING":
            badgeColor = "bg-yellow-600";
            break;
          case "REJECTED":
            badgeColor = "bg-red-600";
            break;
        }
        return (
          <div className="flex items-center gap-2">
            <Badge className={`px-2 py-1 text-xs font-bold tracking-wide ${badgeColor} text-white rounded-full shadow-sm`}>
              {status}
            </Badge>
            <Switch
              checked={status === "APPROVED"}
              onCheckedChange={(checked) => onToggleStatus(row.original.id as number, checked ? "APPROVED" : "PENDING")}
            />
          </div>
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
