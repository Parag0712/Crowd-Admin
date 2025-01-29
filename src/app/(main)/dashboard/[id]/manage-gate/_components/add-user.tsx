"use client";
import React from "react";
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
import { useAddGate } from "@/hooks/gate";

import { gateCreateSchema } from "@/schemas/gate";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type FormInputs = z.infer<typeof gateCreateSchema>;
  
interface AddGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  universityId: number;
}

const AddGateModal: React.FC<AddGateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  universityId,
}) => {
  const { mutate: addGateMutation, isPending } = useAddGate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(gateCreateSchema),
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    addGateMutation(
      {
        location: data.location || "",
        gateId: data.gateId || "",
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
      }
    );
  };

  const formFields = [
    {
      id: "gateId",
      label: "Gate ID",
      type: "text",
      placeholder: "Enter gate ID",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter description",
    },
    {
      id: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] md:max-w-[550px] lg:max-w-[650px] w-full"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Add Gate
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Fill out the form below to add a new gate.
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
              {isPending ? "Adding Gate..." : "Add Gate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGateModal;