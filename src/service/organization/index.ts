import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, OrganizationPayload } from "@/types/index.d";

const ORGANIZATION_API = {
  ADD: "/organization",
  EDIT: (id: number) => `/organization/${id}`,
  DELETE: (id: number) => `/organization/${id}`,
  GET_ALL: "/organization",
  GET_BY_ID: (id: number) => `/organization/${id}`,
} as const;

export const organizationService = {
  add: (organizationData: OrganizationPayload) =>
    fetchHandler<ApiResponse>(ORGANIZATION_API.ADD, "POST", organizationData),

  edit: (
    organizationId: number,
    organizationData: Partial<OrganizationPayload>,
  ) =>
    fetchHandler<ApiResponse>(
      ORGANIZATION_API.EDIT(organizationId),
      "PUT",
      organizationData,
    ),

  delete: (organizationId: number) =>
    fetchHandler<ApiResponse>(
      ORGANIZATION_API.DELETE(organizationId),
      "DELETE",
    ),

  getAll: (page?: number, pageSize?: number, universityId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${ORGANIZATION_API.GET_ALL}?page=${page}&pageSize=${pageSize}&universityId=${universityId}`
        : ORGANIZATION_API.GET_ALL,
      "GET",
    ),

  getById: (organizationId: number) =>
    fetchHandler<ApiResponse>(
      ORGANIZATION_API.GET_BY_ID(organizationId),
      "GET",
    ),
};
