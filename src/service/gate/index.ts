import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, GatePayload } from "@/types/index.d";

const GATE_API = {
  ADD: "/gate",
  EDIT: (id: number) => `/gate/${id}`,
  DELETE: (id: number) => `/gate/${id}`,
  GET_ALL: "/gate",
  GET_BY_ID: (id: number) => `/gate/${id}`,
} as const;

export const gateService = {
  add: (gateData: GatePayload) =>
    fetchHandler<ApiResponse>(GATE_API.ADD, "POST", gateData),

  edit: (gateId: number, gateData: Partial<GatePayload>) =>
    fetchHandler<ApiResponse>(GATE_API.EDIT(gateId), "PUT", gateData),

  delete: (gateId: number) =>
    fetchHandler<ApiResponse>(GATE_API.DELETE(gateId), "DELETE"),

  getAll: (page?: number, pageSize?: number, universityId?: number) =>
    fetchHandler<ApiResponse>(
      page && pageSize
        ? `${GATE_API.GET_ALL}?page=${page}&pageSize=${pageSize}&universityId=${universityId}`
        : GATE_API.GET_ALL,
      "GET",
    ),

  getById: (gateId: number) =>
    fetchHandler<ApiResponse>(GATE_API.GET_BY_ID(gateId), "GET"),
};
