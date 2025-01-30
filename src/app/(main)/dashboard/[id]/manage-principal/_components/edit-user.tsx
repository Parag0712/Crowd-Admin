"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetOrganization } from "@/hooks/organization";
import { useEditPrincipal } from "@/hooks/principal";
import { principalEditSchema } from "@/schemas/principal";
import { userEditSchema } from "@/schemas/users";
import { Organization, Principal, Status, UserStatus } from "@/types/index.d";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
type FormInputs = z.infer<typeof principalEditSchema>;

interface EditPrincipalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedPrincipal: Principal | null;
  universityId: number;
}

const EditPrincipalModal: React.FC<EditPrincipalModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  universityId,
  selectedPrincipal,
}) => {
  const { mutate: editPrincipalMutation, isPending } = useEditPrincipal();
  const { data: organization } = useGetOrganization(universityId);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    setValue,
  } = useForm<FormInputs>({
    resolver: zodResolver(userEditSchema),
  });

  useEffect(() => {
    if (selectedPrincipal) {
      setValue("name", selectedPrincipal.name || "");
      setValue("email", selectedPrincipal.email || "");
      setValue("phoneNumber", selectedPrincipal.phoneNumber || "");
      setValue("isActive", selectedPrincipal.isActive || "ACTIVE");
      setValue("orgId", selectedPrincipal.organizationsAsPrincipal.id || 0);
    }
  }, [selectedPrincipal, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedPrincipal) return;

    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        console.log(`Processing field: ${key}`);
        return value !== undefined && value !== "";
      }),
    ) as Required<Omit<FormInputs, "password">>;

    editPrincipalMutation(
      {
        principalId: Number(selectedPrincipal.id),
        principalData: {
          ...updatedData,
          isActive:
            updatedData.isActive === "ACTIVE" ? Status.ACTIVE : Status.INACTIVE,
        },
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
          }
        },
      },
    );
  };

  const formFields = [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter email address",
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter phone number",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Edit Principal
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to edit this principal.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-sm font-semibold">
                  {field.label} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.id as keyof FormInputs)}
                  className="w-full h-10"
                />
                {errors[field.id as keyof FormInputs] && (
                  <p className="text-red-500 text-xs">
                    {errors[field.id as keyof FormInputs]?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="isActive" className="text-sm font-semibold">
              Organization <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="orgId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {organization?.data.map((org: Organization) => (
                      <SelectItem
                        key={org.id}
                        value={org.id.toString()}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.orgId && (
              <p className="text-red-500 text-xs">{errors.orgId.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="isActive" className="text-sm font-semibold">
              Status <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className="w-full h-10">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      {
                        label: "ACTIVE",
                        value: UserStatus.ACTIVE,
                      },
                      {
                        label: "INACTIVE",
                        value: UserStatus.INACTIVE,
                      },
                    ].map((status, index) => (
                      <SelectItem
                        key={index}
                        value={status.value.toString()}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.isActive && (
              <p className="text-red-500 text-xs">{errors.isActive.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 bg-primary"
            >
              {isPending ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPrincipalModal;
