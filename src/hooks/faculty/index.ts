import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationError,
  handleMutationSuccess,
} from "@/lib/mutation-utils";
import { facultyService } from "@/service/faculty";
import { Approve_Status, FacultyPayload } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFaculty = (
  page?: number,
  pageSize?: number,
  organizationId?: number,
) => {
  return useQuery({
    queryKey: ["faculty", page, pageSize, organizationId],
    enabled: !!page && !!pageSize && !!organizationId,
    queryFn: async () => {
      const response = await facultyService.getAll(
        page,
        pageSize,
        organizationId,
      );
      return response;
    },
  });
};

export const useGetFaculty = (id: number) => {
  return useQuery({
    queryKey: ["faculty", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await facultyService.getById(id);
      return response;
    },
  });
};

export const useGetFacultyByBranchId = (id: number) => {
  return useQuery({
    queryKey: ["faculty-by-branchId", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await facultyService.getByBranchId(id);
      return response;
    },
  });
};

export const useGetAllFacultyApproveList = (orgId: number) => {
  return useQuery({
    queryKey: ["faculty-all-approve-list", orgId],
    queryFn: async () => {
      const response = await facultyService.getApprovalList(orgId);
      return response;
    },
  });
};

export const useApproveFaculty = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      facultyId,
      status,
    }: {
      facultyId: number;
      status: Approve_Status;
    }) => facultyService.approveFaculty(facultyId, status),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, [
        "faculty-all-approve-list",
      ]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useAddFaculty = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: facultyService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["hod"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditFaculty = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      facultyId,
      facultyData,
    }: {
      facultyId: number;
      facultyData: Partial<FacultyPayload>;
    }) => facultyService.edit(facultyId, facultyData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["hod"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteFaculty = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: facultyService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["hod"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
