import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, Approve_Status, FacultyPayload } from "@/types/index.d";

const FACULTY_API = {
  ADD: "/faculty",
  EDIT: (id: number) => `/faculty/${id}`,
  DELETE: (id: number) => `/faculty/${id}`,
  GET_ALL: "/faculty",
  GET_BY_ID: (id: number) => `/faculty/${id}`,
  APPROVE_FACULTY: (id: number, status: Approve_Status) =>
    `/faculty/approve/${id}?status=${status}`,
  GET_ALL_APPROVE_LIST: "/faculty/allApprovalList",
} as const;

export const facultyService = {
  add: (facultyData: FacultyPayload) =>
    fetchHandler<ApiResponse>(FACULTY_API.ADD, "POST", facultyData),

  edit: (facultyId: number, facultyData: Partial<FacultyPayload>) =>
    fetchHandler<ApiResponse>(FACULTY_API.EDIT(facultyId), "PUT", facultyData),

  delete: (facultyId: number) =>
    fetchHandler<ApiResponse>(FACULTY_API.DELETE(facultyId), "DELETE"),

  getAll: (page?: number, pageSize?: number, organizationId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${FACULTY_API.GET_ALL}?page=${page}&pageSize=${pageSize}&orgId=${organizationId}`
        : FACULTY_API.GET_ALL,
      "GET",
    ),

  getByBranchId: (branchId: number) =>
    fetchHandler<ApiResponse>(
      `${FACULTY_API.GET_ALL}?branchId=${branchId}`,
      "GET",
    ),
  getById: (facultyId: number) =>
    fetchHandler<ApiResponse>(FACULTY_API.GET_BY_ID(facultyId), "GET"),

  approveFaculty: (facultyId: number, status: Approve_Status) =>
    fetchHandler<ApiResponse>(
      FACULTY_API.APPROVE_FACULTY(facultyId, status),
      "PATCH",
    ),

  getApprovalList: (orgId: number) =>
    fetchHandler<ApiResponse>(
      `${FACULTY_API.GET_ALL_APPROVE_LIST}?orgId=${orgId}`,
      "GET",
    ),
};
