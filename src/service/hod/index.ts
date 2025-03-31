import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, Approve_Status, HodPayload } from "@/types/index.d";

const HOD_API = {
  ADD: "/hod",
  EDIT: (id: number) => `/hod/${id}`,
  DELETE: (id: number) => `/hod/${id}`,
  GET_ALL: "/hod",
  GET_BY_ID: (id: number) => `/hod/${id}`,
  APPROVE_HOD: (id: number, status: Approve_Status) =>
    `/hod/approve/${id}?status=${status}`,
  GET_ALL_APPROVE_LIST: "/hod/allApprovalList",
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

  approveHod: (hodId: number, status: Approve_Status) =>
    fetchHandler<ApiResponse>(HOD_API.APPROVE_HOD(hodId, status), "PATCH"),

  getApprovalList: (orgId: number) =>
    fetchHandler<ApiResponse>(
      `${HOD_API.GET_ALL_APPROVE_LIST}?orgId=${orgId}`,
      "GET",
    ),

  getById: (hodId: number) =>
    fetchHandler<ApiResponse>(HOD_API.GET_BY_ID(hodId), "GET"),
};
