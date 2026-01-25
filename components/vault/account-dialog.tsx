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
  account?: Account;
  onSubmit: (data: AccountFormData) => void;
}

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

  const formKey = account?.id ?? "new";

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
        {open && (
          <AccountForm
            key={formKey}
            initialData={account}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
