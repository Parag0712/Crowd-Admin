import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationError,
  handleMutationSuccess,
} from "@/lib/mutation-utils";
import { branchService } from "@/service/branch";
import { BranchPayload } from "@/types/index.d";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBranch = (page?: number, pageSize?: number, orgId?: number) => {
  return useQuery({
    queryKey: ["branch", page, pageSize, orgId],
    queryFn: async () => {
      const response = await branchService.getAll(page, pageSize, orgId);
      return response;
    },
  });
};

export const useGetBranch = (id: number) => {
  return useQuery({
    queryKey: ["branch", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await branchService.getAll(1, 10, id);
      return response;
    },
  });
};

export const useAddBranch = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: branchService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["branch"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditBranch = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      branchId,
      branchData,
    }: {
      branchId: number;
      branchData: Partial<BranchPayload>;
    }) => branchService.edit(branchId, branchData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["branch"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: branchService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["branch"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
