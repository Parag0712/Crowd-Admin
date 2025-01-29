import axiosInstance from "@/lib/axiosInstance";
import { LoginResponse } from "@/types";

async function fetchHandler<T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  options?: object
): Promise<T> {
  try {
    const response = await axiosInstance.request<T>({
      url,
      method,
      data: options,
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      return {
        success: false,
        statusCode: err.response?.status || 500,
        message: err.response?.data?.message || "An error occurred",
      } as T;
    }
    return {
      success: false,
      statusCode: 500,
      message: "An error occurred",
    } as T;
  }
}

export async function loginAdmin(
  email: string,
  password: string
): Promise<LoginResponse> {
  return fetchHandler<LoginResponse>("/admin/login", "POST", {
    email,
    password,
  });
}

export async function forgetPassword(email: string): Promise<LoginResponse> {
  return fetchHandler<LoginResponse>("/admin/forget-password", "POST", {
    email,
  });
}

export async function resetPassword(
  token: string,
  password: string,
  email: string
): Promise<LoginResponse> {
  return fetchHandler<LoginResponse>("/admin/reset-password", "POST", {
     email,
    token,
    password,
  });
}

export async function importFile(
  file: File,
  project_id: number
): Promise<LoginResponse> {
  return fetchHandler<LoginResponse>("/import-data", "POST", {
    file,
    project_id,
  });
}
