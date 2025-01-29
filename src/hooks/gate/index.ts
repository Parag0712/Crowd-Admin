import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { GatePayload } from "@/types/index.d";
import { gateService } from "@/service/gate";

export const useGate = (
  page?: number,
  pageSize?: number,
  universityId?: number,
) => {
  return useQuery({
    queryKey: ["gate", page, pageSize],
    queryFn: async () => {
      const response = await gateService.getAll(page, pageSize, universityId);
      return response;
    },
  });
};

export const useGetGate = (id: number) => {
  return useQuery({
    queryKey: ["gate", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await gateService.getAll(1, 10, id);
      return response;
    },
  });
};

export const useAddGate = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: gateService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["gate"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditGate = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      gateId,
      gateData,
    }: {
      gateId: number;
      gateData: Partial<GatePayload>;
    }) => gateService.edit(gateId, gateData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["gate"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteGate = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: gateService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["gate"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
