import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { HodPayload } from "@/types/index.d";
import { hodService } from "@/service/hod";

export const useHod = (
  page?: number,
  pageSize?: number,
  organizationId?: number,
) => {
  return useQuery({
    queryKey: ["hod", page, pageSize],
    queryFn: async () => {
      const response = await hodService.getAll(page, pageSize, organizationId);
      return response;
    },
  });
};

export const useGetPrincipal = (id: number) => {
  return useQuery({
    queryKey: ["hod", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await hodService.getById(id);
      return response;
    },
  });
};

export const useAddHod = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: hodService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["hod"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditHod = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      hodId,
      hodData,
    }: {
      hodId: number;
      hodData: Partial<HodPayload>;
    }) => hodService.edit(hodId, hodData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["hod"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteHod = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: hodService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["hod"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
