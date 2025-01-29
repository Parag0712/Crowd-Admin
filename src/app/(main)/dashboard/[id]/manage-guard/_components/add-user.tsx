"use client";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
// import { userCreateSchema } from "@/schemas/users/adduserschema";
// import { useAddUser } from "@/hooks/users/manage-users";
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
import { useAddGuard } from "@/hooks/guard";
import { guardCreateSchema } from "@/schemas/guard";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserStatus } from "@/types/index.d";
import { Eye, EyeOff } from "lucide-react";

type FormInputs = z.infer<typeof guardCreateSchema>;

interface AddGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  universityId: number;
}

const AddGuardModal: React.FC<AddGuardModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  universityId,
}) => {
  const { mutate: addGuardMutation, isPending } = useAddGuard();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(guardCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addGuardMutation(
      {
        ...data,
        universityId: universityId,
        isActive: UserStatus.ACTIVE,
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
      label: "Phone",
      type: "tel",
      placeholder: "Enter phone number",
    },
    {
      id: "employeeId",
      label: "Employee ID",
      type: "text",
      placeholder: "Enter employee ID",
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
            Add Guard
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to add a new guard.
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
            <Label htmlFor="password" className="text-sm font-semibold">
              Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password")}
                className="w-full h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-3 text-gray-600"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
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
              {isPending ? "Adding User..." : "Add User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGuardModal;
