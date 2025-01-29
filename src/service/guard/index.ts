import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, GuardPayload } from "@/types/index.d";

const GUARD_API = {
  ADD: "/guard",
  EDIT: (id: number) => `/guard/${id}`,
  DELETE: (id: number) => `/guard/${id}`,
  GET_ALL: "/guard",
  GET_BY_ID: (id: number) => `/guard/${id}`,
} as const;

export const guardService = {
  add: (guardData: GuardPayload) =>
    fetchHandler<ApiResponse>(GUARD_API.ADD, "POST", guardData),

  edit: (guardId: number, guardData: Partial<GuardPayload>) =>
    fetchHandler<ApiResponse>(GUARD_API.EDIT(guardId), "PUT", guardData),

  delete: (guardId: number) =>
    fetchHandler<ApiResponse>(GUARD_API.DELETE(guardId), "DELETE"),

  getAll: (page?: number, pageSize?: number, universityId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${GUARD_API.GET_ALL}?page=${page}&pageSize=${pageSize}&universityId=${universityId}`
        : GUARD_API.GET_ALL,
      "GET",
    ),

  getById: (guardId: number) =>
    fetchHandler<ApiResponse>(GUARD_API.GET_BY_ID(guardId), "GET"),
};
