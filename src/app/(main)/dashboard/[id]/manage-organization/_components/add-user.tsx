"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { organizationCreateSchema } from "@/schemas/organization";
import { useAddOrganization } from "@/hooks/organization";

type FormInputs = z.infer<typeof organizationCreateSchema>;

interface AddOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  universityId: number;
}

const AddOrganizationModal: React.FC<AddOrganizationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  universityId,
}) => {
  const { mutate: addOrganizationMutation, isPending } = useAddOrganization();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(organizationCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addOrganizationMutation(
      {
        name: data.name || "",
        description: data.description || "",
        universityId: universityId,
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
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter description",
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
            Add Organization
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to add a new organization.
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
              {isPending ? "Adding Organization..." : "Add Organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrganizationModal;
