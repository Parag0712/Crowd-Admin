import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, HodPayload } from "@/types/index.d";

const HOD_API = {
  ADD: "/hod",
  EDIT: (id: number) => `/hod/${id}`,
  DELETE: (id: number) => `/hod/${id}`,
  GET_ALL: "/hod",
  GET_BY_ID: (id: number) => `/hod/${id}`,
  GET_APPROVAL_LIST: (id: number) => `/hod/approvalList/${id}`,
} as const;

export const hodService = {
  add: (hodData: HodPayload) =>
    fetchHandler<ApiResponse>(HOD_API.ADD, "POST", hodData),

  edit: (hodId: number, hodData: Partial<HodPayload>) =>
    fetchHandler<ApiResponse>(HOD_API.EDIT(hodId), "PUT", hodData),

  delete: (hodId: number) =>
    fetchHandler<ApiResponse>(HOD_API.DELETE(hodId), "DELETE"),

  getAll: (page?: number, pageSize?: number, organizationId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${HOD_API.GET_ALL}?page=${page}&pageSize=${pageSize}&orgId=${organizationId}`
        : HOD_API.GET_ALL,
      "GET",
    ),

  getById: (hodId: number) =>
    fetchHandler<ApiResponse>(HOD_API.GET_BY_ID(hodId), "GET"),

  getApprovalList: (hodId: number) =>
    fetchHandler<ApiResponse>(HOD_API.GET_APPROVAL_LIST(hodId), "GET"),
};
