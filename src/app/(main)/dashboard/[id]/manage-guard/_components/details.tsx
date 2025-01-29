import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Guard } from "@/types";

interface UserDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  guard: Guard | null;
}

const UserDetails: React.FC<UserDetailsProps> = ({
  isOpen,
  onClose,
  guard,
}) => {
  if (!guard) return null;

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
            User Details
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
                  <p className="text-xs text-gray-500">First Name</p>
                  <p className="font-medium text-sm text-gray-900">
                    {guard.name}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg col-span-2">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-sm text-gray-900 break-words">
                    {guard.email}
                  </p>
                </div>

                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-sm text-gray-900">
                    {guard.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-sm text-primary mb-3">
                Account Status
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Status</p>
                  <p className="font-medium text-sm text-gray-900">
                    {guard.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  <p className="text-xs text-gray-500">Created At</p>
                  <p className="font-medium text-sm text-gray-900">
                    {formatDate(guard.createdAt)}
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

export default UserDetails;
