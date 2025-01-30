import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Hod } from "@/types/index.d";
import React from "react";

interface HodDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  hod: Hod | null;
}

const HodDetails: React.FC<HodDetailsProps> = ({
  isOpen,
  onClose,
  hod,
}) => {
  if (!hod) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[450px] p-4"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Hod Details
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-sm text-primary mb-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-medium text-sm text-gray-900">
                    {hod.name}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500">Description</p>
                  <p className="font-medium text-sm text-gray-900 break-words">
                    {hod.email}
                  </p>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-sm text-gray-900">
                    {hod.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-sm text-primary mb-3">
                Branch Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-sm text-gray-900">
                    {hod.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="font-medium text-sm text-gray-900">
                    {formatDate(hod.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HodDetails;
