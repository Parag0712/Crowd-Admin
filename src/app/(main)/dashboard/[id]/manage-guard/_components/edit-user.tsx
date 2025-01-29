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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEditGuard } from "@/hooks/guard";
import { guardEditSchema } from "@/schemas/guard";
import { userEditSchema } from "@/schemas/users";
import { Guard, UserStatus } from "@/types/index.d";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
type FormInputs = z.infer<typeof guardEditSchema>;

interface EditGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedGuard: Guard | null;
  universityId: number;
}

const EditGuardModal: React.FC<EditGuardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  universityId,
  selectedGuard,
}) => {
  const { mutate: editGuardMutation, isPending } = useEditGuard();

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
    if (selectedGuard) {
      setValue("name", selectedGuard.name || "");
      setValue("email", selectedGuard.email || "");
      setValue("phoneNumber", selectedGuard.phoneNumber || "");
      setValue("employeeId", selectedGuard.employeeId || "");
      setValue("isActive", selectedGuard.isActive || "ACTIVE");
    }
  }, [selectedGuard, setValue]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    if (!selectedGuard) return;

    const updatedData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        console.log(`Processing field: ${key}`);
        return value !== undefined && value !== "";
      })
    ) as Required<Omit<FormInputs, "password">>;

    editGuardMutation(
      { guardId: Number(selectedGuard.id), guardData: {
        ...updatedData,
        universityId: universityId,
        gateId: selectedGuard.gateId ?? undefined,
        isActive: UserStatus.ACTIVE || UserStatus.INACTIVE,
      } },
      {
        onSuccess: (response) => {
          if (response.success) {
            onClose();
            onSuccess();
            reset();
          }
        },
      }
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
    {
      id: "employeeId",
      label: "Employee ID",
      type: "tel",
      placeholder: "Enter Employee ID",
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
            Edit User
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to edit this user.
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
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent> 
                    {[
                      {
                        label: "ACTIVE",
                        value: "ACTIVE",
                      },
                      {
                        label: "INACTIVE",
                        value: "INACTIVE",
                      },
                    ].map((role, index) => (
                      <SelectItem
                        key={index}
                        value={role.value.toString()}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {role.label}
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

export default EditGuardModal;
