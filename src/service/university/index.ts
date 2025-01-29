import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, UniversityPayload } from "@/types/index.d";

const UNIVERSITY_API = {
  ADD: "/university",
  EDIT: (id: number) => `/university/${id}`,
  DELETE: (id: number) => `/university/${id}`,
  GET_ALL: "/university",
  GET_BY_ID: (id: number) => `/university/${id}`,
} as const;

export const universityService = {
  add: (universityData: UniversityPayload) =>
    fetchHandler<ApiResponse>(UNIVERSITY_API.ADD, "POST", universityData),

  edit: (universityId: number, universityData: Partial<UniversityPayload>) =>
    fetchHandler<ApiResponse>(UNIVERSITY_API.EDIT(universityId), "PUT", universityData),

  delete: (universityId: number) =>
    fetchHandler<ApiResponse>(UNIVERSITY_API.DELETE(universityId), "DELETE"),

  getAll: (page?: number, pageSize?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${UNIVERSITY_API.GET_ALL}?page=${page}&pageSize=${pageSize}`
        : UNIVERSITY_API.GET_ALL,
      "GET"
    ),
    
  getById: (universityId: number) =>
    fetchHandler<ApiResponse>(UNIVERSITY_API.GET_BY_ID(universityId), "GET"),
};
