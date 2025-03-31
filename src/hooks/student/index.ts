import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { studentService } from "@/service/student";
import { Approve_Status, StundetPayload } from "@/types";

export const useStudent = (
  page?: number,
  pageSize?: number,
  organizationId?: number,
) => {
  return useQuery({
    queryKey: ["student", page, pageSize],
    queryFn: async () => {
      const response = await studentService.getAll(
        page,
        pageSize,
        organizationId,
      );
      return response;
    },
  });
};

export const useGetStunde = (id: number) => {
  return useQuery({
    queryKey: ["student", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await studentService.getById(id);
      return response;
    },
  });
};

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: studentService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["student"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useGetAllStudentApproveList = (orgId: number) => {
  return useQuery({
    queryKey: ["student-all-approve-list", orgId],
    queryFn: async () => {
      const response = await studentService.getApprovalList(orgId);
      return response;
    },
  });
};

export const useApproveStudent = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      studentId,
      status,
    }: {
      studentId: number;
      status: Approve_Status;
    }) => studentService.approveStudent(studentId, status),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, [
        "student-all-approve-list",
      ]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditStudent = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      studentId,
      studentData,
    }: {
      studentId: number;
      studentData: Partial<StundetPayload>;
    }) => studentService.edit(studentId, studentData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["student"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: studentService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["student"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
