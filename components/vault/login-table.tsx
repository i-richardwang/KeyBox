"use client";

import { useState, useMemo } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import type { EmailAccount } from "@/lib/types/account";
import { DataTable } from "./data-table";
import { getLoginColumns } from "./columns/login-columns";
import { AccountDialog } from "./account-dialog";
import { DeleteDialog } from "./delete-dialog";
import { BulkDeleteDialog } from "./bulk-delete-dialog";
import { BulkEditDialog } from "./bulk-edit-dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import type { AccountFormData } from "./account-form";

type EmailAccountUpdateData = Partial<Pick<EmailAccount, "type" | "email" | "password" | "totpSecret" | "recoveryEmail">>;

interface LoginTableProps {
  accounts: EmailAccount[];
  onUpdate: (id: string, data: EmailAccountUpdateData) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onBulkUpdate: (ids: string[], data: { type?: string; provider?: string }) => void;
  emptyMessage?: string;
}

export function LoginTable({
  accounts,
  onUpdate,
  onDelete,
  onBulkDelete,
  onBulkUpdate,
  emptyMessage = "No login accounts",
}: LoginTableProps) {
  const [editingAccount, setEditingAccount] = useState<EmailAccount | null>(
    null
  );
  const [deletingAccount, setDeletingAccount] = useState<EmailAccount | null>(
    null
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);

  const selectedIds = Object.keys(rowSelection);
  const selectedCount = selectedIds.length;

  const columns = useMemo(
    () =>
      getLoginColumns({
        onEdit: setEditingAccount,
        onDelete: setDeletingAccount,
      }),
    []
  );

  const handleEditSubmit = (data: AccountFormData) => {
    if (!editingAccount) return;
    onUpdate(editingAccount.id, {
      type: data.loginType,
      email: data.email,
      password: data.password,
      totpSecret: data.totpSecret,
      recoveryEmail: data.recoveryEmail,
    });
    setEditingAccount(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingAccount) {
      onDelete(deletingAccount.id);
      setDeletingAccount(null);
    }
  };

  const handleBulkDeleteConfirm = () => {
    onBulkDelete(selectedIds);
    setRowSelection({});
  };

  const handleBulkEditConfirm = (data: { type?: string; provider?: string }) => {
    onBulkUpdate(selectedIds, data);
    setRowSelection({});
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={accounts}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id}
        emptyMessage={emptyMessage}
      />

      {selectedCount > 0 && (
        <div className="flex items-center justify-end gap-2 -mt-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkEditOpen(true)}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
            Edit Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
            Delete Selected
          </Button>
        </div>
      )}

      <AccountDialog
        open={!!editingAccount}
        onOpenChange={(open) => !open && setEditingAccount(null)}
        account={editingAccount || undefined}
        onSubmit={handleEditSubmit}
      />

      <DeleteDialog
        open={!!deletingAccount}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
        onConfirm={handleDeleteConfirm}
        accountName={deletingAccount?.email || ""}
      />

      <BulkDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={handleBulkDeleteConfirm}
        count={selectedCount}
        itemType="account"
      />

      <BulkEditDialog
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        onConfirm={handleBulkEditConfirm}
        count={selectedCount}
        mode="login"
      />
    </>
  );
}
