import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, PrincipalPayload } from "@/types/index.d";

const PRINCIPAL_API = {
  ADD: "/principal",
  EDIT: (id: number) => `/principal/${id}`,
  DELETE: (id: number) => `/principal/${id}`,
  GET_ALL: "/principal",
  GET_BY_ID: (id: number) => `/principal/${id}`,
  GET_APPROVAL_LIST: (id: number) => `/principal/approvalList/${id}`,
} as const;

export const principalService = {
  add: (principalData: PrincipalPayload) =>
    fetchHandler<ApiResponse>(PRINCIPAL_API.ADD, "POST", principalData),

  edit: (principalId: number, principalData: Partial<PrincipalPayload>) =>
    fetchHandler<ApiResponse>(
      PRINCIPAL_API.EDIT(principalId),
      "PUT",
      principalData,
    ),

  delete: (principalId: number) =>
    fetchHandler<ApiResponse>(PRINCIPAL_API.DELETE(principalId), "DELETE"),

  getAll: (page?: number, pageSize?: number, universityId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${PRINCIPAL_API.GET_ALL}?page=${page}&pageSize=${pageSize}&universityId=${universityId}`
        : PRINCIPAL_API.GET_ALL,
      "GET",
    ),

  getById: (principalId: number) =>
    fetchHandler<ApiResponse>(PRINCIPAL_API.GET_BY_ID(principalId), "GET"),

  getApprovalList: (principalId: number) =>
    fetchHandler<ApiResponse>(
      PRINCIPAL_API.GET_APPROVAL_LIST(principalId),
      "GET",
    ),
};
