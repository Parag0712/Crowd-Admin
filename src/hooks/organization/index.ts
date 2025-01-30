import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/components/providers/toaster-provider";
import {
  handleMutationSuccess,
  handleMutationError,
} from "@/lib/mutation-utils";
import { OrganizationPayload } from "@/types/index.d";
import { organizationService } from "@/service/organization";

export const useOrganization = (
  page?: number,
  pageSize?: number,
  universityId?: number,
) => {
  return useQuery({
    queryKey: ["organization", page, pageSize],
    queryFn: async () => {
      const response = await organizationService.getAll(
        page,
        pageSize,
        universityId,
      );
      return response;
    },
  });
};

export const useGetOrganization = (id: number) => {
  return useQuery({
    queryKey: ["organization", id],
    enabled: !!id,
    queryFn: async () => {
      const response = await organizationService.getAll(1, 10, id);
      return response;
    },
  });
};

export const useAddOrganization = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: organizationService.add,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["organization"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useEditOrganization = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: ({
      organizationId,
      organizationData,
    }: {
      organizationId: number;
      organizationData: Partial<OrganizationPayload>;
    }) => organizationService.edit(organizationId, organizationData),
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["organization"]),
    onError: (error) => handleMutationError(error, toast),
  });
};

export const useDeleteOrganization = () => {
  const queryClient = useQueryClient();
  const toast = useCustomToast();

  return useMutation({
    mutationFn: organizationService.delete,
    onSuccess: (response) =>
      handleMutationSuccess(response, toast, queryClient, ["organization"]),
    onError: (error) => handleMutationError(error, toast),
  });
};
