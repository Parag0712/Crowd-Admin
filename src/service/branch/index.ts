import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, BranchPayload } from "@/types/index.d";

const BRANCH_API = {
  ADD: "/branch",
  EDIT: (id: number) => `/branch/${id}`,
  DELETE: (id: number) => `/branch/${id}`,
  GET_ALL: "/branch",
  GET_BY_ID: (id: number) => `/branch/${id}`,
} as const;

export const branchService = {
  add: (branchData: BranchPayload) =>
    fetchHandler<ApiResponse>(BRANCH_API.ADD, "POST", branchData),

  edit: (branchId: number, branchData: Partial<BranchPayload>) =>
    fetchHandler<ApiResponse>(BRANCH_API.EDIT(branchId), "PUT", branchData),

  delete: (branchId: number) =>
    fetchHandler<ApiResponse>(BRANCH_API.DELETE(branchId), "DELETE"),

  getAll: (page?: number, pageSize?: number, orgId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${BRANCH_API.GET_ALL}?page=${page}&pageSize=${pageSize}&orgId=${orgId}`
        : BRANCH_API.GET_ALL,
      "GET",
    ),

  getById: (branchId: number) =>
    fetchHandler<ApiResponse>(BRANCH_API.GET_BY_ID(branchId), "GET"),
};
