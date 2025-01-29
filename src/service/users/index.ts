import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, UserPayload } from "@/types/index.d";

const USER_API = {
  ADD: "/admin/",
  EDIT: (id: number) => `/admin/${id}`,
  DELETE: (id: number) => `/admin/${id}`,
  GET_ALL: "/admin/",
  GET_BY_ID: (id: number) => `/admin/${id}`,
} as const;

export const userService = {
  add: (userData: UserPayload) =>
    fetchHandler<ApiResponse>(USER_API.ADD, "POST", userData),

  edit: (userId: number, userData: Partial<Omit<UserPayload, "password">>) =>
    fetchHandler<ApiResponse>(USER_API.EDIT(userId), "PUT", userData),

  delete: (userId: number) =>
    fetchHandler<ApiResponse>(USER_API.DELETE(userId), "DELETE"),

  getAll: (page: number, pageSize: number) =>
    fetchHandler<ApiResponse>(
      `${USER_API.GET_ALL}?page=${page}&pageSize=${pageSize}`,
      "GET"
    ),

  getById: (userId: number) =>
    fetchHandler<ApiResponse>(USER_API.GET_BY_ID(userId), "GET"),
};
