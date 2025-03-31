import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, Approve_Status, StundetPayload } from "@/types/index.d";

const STUDENT_API = {
  ADD: "/student",
  EDIT: (id: number) => `/student/${id}`,
  DELETE: (id: number) => `/student/${id}`,
  GET_ALL: "/student",
  GET_BY_ID: (id: number) => `/student/${id}`,
  APPROVE_STUDENT: (id: number, status: Approve_Status) =>
    `/student/approve/${id}?status=${status}`,
  GET_ALL_APPROVE_LIST: "/student/allApprovalList",
} as const;

export const studentService = {
  add: (studentData: StundetPayload) =>
    fetchHandler<ApiResponse>(STUDENT_API.ADD, "POST", studentData),

  edit: (studentId: number, studentData: Partial<StundetPayload>) =>
    fetchHandler<ApiResponse>(STUDENT_API.EDIT(studentId), "PUT", studentData),

  delete: (studentId: number) =>
    fetchHandler<ApiResponse>(STUDENT_API.DELETE(studentId), "DELETE"),

  getAll: (page?: number, pageSize?: number, organizationId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${STUDENT_API.GET_ALL}?page=${page}&pageSize=${pageSize}&orgId=${organizationId}`
        : STUDENT_API.GET_ALL,
      "GET",
    ),

  getById: (studentId: number) =>
    fetchHandler<ApiResponse>(STUDENT_API.GET_BY_ID(studentId), "GET"),

  approveStudent: (studentId: number, status: Approve_Status) =>
    fetchHandler<ApiResponse>(
      STUDENT_API.APPROVE_STUDENT(studentId, status),
      "PATCH",
    ),

  getApprovalList: (orgId: number) =>
    fetchHandler<ApiResponse>(
      `${STUDENT_API.GET_ALL_APPROVE_LIST}?orgId=${orgId}`,
      "GET",
    ),
};
