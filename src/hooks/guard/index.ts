import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { GuardPayload } from "@/types/index.d";
import { guardService } from "@/service/guard";

export const useGuard = (page?: number, pageSize?: number, universityId?: number) => {
  return useQuery({
    queryKey: ["guard", page, pageSize],
    queryFn: async () => {
      const response = await guardService.getAll(page, pageSize,universityId);
      return response;
    },
  });
};

export const useGetGuard = (id: number) => {
  return useQuery({
    queryKey: ["guard", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await guardService.getAll(1, 10, id);
      return response;
    },
  });
};

export const useAddGuard = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: guardService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["guard"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditGuard = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      guardId,
      guardData,
    }: {
      guardId: number;
      guardData: Partial<GuardPayload>;
    }) => guardService.edit(guardId, guardData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["guard"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteGuard = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: guardService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["guard"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
