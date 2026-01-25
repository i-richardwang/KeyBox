"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccountForm, type AccountFormData } from "./account-form";
import type { Account } from "@/lib/types/account";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: Account; // If provided, dialog is in edit mode
  onSubmit: (data: AccountFormData) => void;
}

/**
 * Dialog for adding or editing an account
 */
export function AccountDialog({
  open,
  onOpenChange,
  account,
  onSubmit,
}: AccountDialogProps) {
  const isEditing = !!account;

  const handleSubmit = (data: AccountFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Account" : "Add Account"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the account details below."
              : "Enter the details for your new account."}
          </DialogDescription>
        </DialogHeader>
        <AccountForm
          initialData={account}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
