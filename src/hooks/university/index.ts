import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { universityService } from "@/service/university";
import { UniversityPayload } from "@/types/index.d";

export const useUniversity = (page?: number, pageSize?: number) => {
  return useQuery({
    queryKey: ["university", page, pageSize],
    queryFn: async () => {
      const response = await universityService.getAll(page, pageSize);
      return response;
    },
  });
};

export const useGetUniversity = (id: number) => {
  return useQuery({
    queryKey: ["university", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await universityService.getById(id);
      return response;
    },
  });
};

export const useAddUniversity = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: universityService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["users"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditUniversity = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      universityId,
      universityData,
    }: {
      universityId: number;
      universityData: Partial<UniversityPayload>;
    }) => universityService.edit(universityId, universityData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["university"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: universityService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["university"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
