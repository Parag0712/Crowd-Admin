import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { PrincipalPayload } from "@/types/index.d";
import { principalService } from "@/service/principal";

export const usePrincipal = (
  page?: number,
  pageSize?: number,
  universityId?: number,
) => {
  return useQuery({
    queryKey: ["principal", page, pageSize],
    queryFn: async () => {
      const response = await principalService.getAll(
        page,
        pageSize,
        universityId,
      );
      return response;
    },
  });
};

export const useGetPrincipal = (id: number) => {
  return useQuery({
    queryKey: ["principal", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await principalService.getById(id);
      return response;
    },
  });
};

export const useAddPrincipal = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: principalService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["principal"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditPrincipal = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      principalId,
      principalData,
    }: {
      principalId: number;
      principalData: Partial<PrincipalPayload>;
    }) => principalService.edit(principalId, principalData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["principal"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeletePrincipal = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: principalService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["principal"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
